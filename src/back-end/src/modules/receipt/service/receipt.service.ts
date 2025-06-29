import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { CreateReceiptInput } from '../models/receipt.input';
import { v4 as uuidv4 } from 'uuid'; // Import UUID library
import { ReceiptParams } from '../models/receipt.params';
import { ReceiptDto } from '../models/receipt.dto';

@Injectable()
export class ReceiptService {
  private generateUniqueId(): string {
    return uuidv4(); // Generate a unique ID
  }
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateReceiptInput, nhan_vien_thu_tien: string) {
    // 1. Kiểm tra đại lý tồn tại
    const daiLy = await this.prisma.daiLy.findUnique({ where: { daily_id: input.daily_id } });
    if (!daiLy) throw new BadRequestException('Đại lý không tồn tại');

    // 2. Kiểm tra số tiền thu <= công nợ hiện tại
    if (input.so_tien_thu > daiLy.tien_no) {
      throw new BadRequestException('Số tiền thu vượt quá số tiền đại lý đang nợ');
    }

    // 3. Kiểm tra ngày thu không quá ngày hiện tại
    const ngayThu = new Date(input.ngay_thu);
    const now = new Date();
    if (ngayThu > now) {
      throw new BadRequestException('Ngày thu không được vượt quá ngày hiện tại');
    }

    const phieuThu = await this.prisma.phieuThuTien.create({
      data: {
        phieu_thu_id: this.generateUniqueId(), // Add a unique ID for phieu_thu_id
        daily_id: input.daily_id,
        ngay_thu: ngayThu,
        so_tien_thu: input.so_tien_thu,
        nhan_vien_thu_tien: nhan_vien_thu_tien,
      },
    });

    // 5. Cập nhật lại công nợ đại lý
    await this.prisma.daiLy.update({
      where: { daily_id: input.daily_id },
      data: { tien_no: { decrement: input.so_tien_thu } },
    });

    return { message: 'Tạo phiếu thu thành công', phieuThu };
  }

  async findAll(params: ReceiptParams): Promise<ReceiptDto[]> {
    const page = params.page ? Number(params.page) : 1;
    const perPage = params.perPage ? Number(params.perPage) : 10;

    let dailyIds: string[] | undefined = undefined;
    if (params.ten_dai_ly) {
      const daiLys = await this.prisma.daiLy.findMany({
        where: { ten: { contains: params.ten_dai_ly, mode: 'insensitive' } },
        select: { daily_id: true },
      });
      dailyIds = daiLys.map(d => d.daily_id);
      if (dailyIds.length === 0) return [];
    }

    const where: any = {};
    if (dailyIds) where.daily_id = { in: dailyIds };
    if (params.nhan_vien_thu_tien) {
      // Tìm các nhân viên có tên giống tên tìm kiếm
      const nhanViens = await this.prisma.nhanVien.findMany({
        where: { ten: { contains: params.nhan_vien_thu_tien, mode: 'insensitive' } },
        select: { nhan_vien_id: true },
      });
      const nhanVienIds = nhanViens.map(nv => nv.nhan_vien_id);
      if (nhanVienIds.length === 0) return [];
      where.nhan_vien_thu_tien = { in: nhanVienIds };
    }
    if (params.ngay_thu) {
      const date = new Date(params.ngay_thu);
      const start = new Date(date.setHours(0, 0, 0, 0));
      const end = new Date(date.setHours(23, 59, 59, 999));
      where.ngay_thu = { gte: start, lte: end };
    }
    const receipts = await this.prisma.phieuThuTien.findMany({
      where,
      orderBy: { ngay_thu: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return receipts.map(r => new ReceiptDto(r));
  }

  async findOne(phieu_thu_id: string): Promise<ReceiptDto> {
    const receipt = await this.prisma.phieuThuTien.findUnique({
      where: { phieu_thu_id },
    });
    if (!receipt) throw new NotFoundException('Không tìm thấy phiếu thu');
    return new ReceiptDto(receipt);
  }
}