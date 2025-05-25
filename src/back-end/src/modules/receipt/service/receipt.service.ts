import { Injectable, BadRequestException } from '@nestjs/common';
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

  async create(input: CreateReceiptInput) {
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
        nhan_vien_thu_tien: input.nhan_vien_thu_tien,
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

    const receipts = await this.prisma.phieuThuTien.findMany({
      where: {
        daily_id: params.daily_id,
        nhan_vien_thu_tien: params.nhan_vien_thu_tien,
        // Thêm các điều kiện khác nếu cần
      },
      orderBy: { ngay_thu: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage,
    });
    return receipts.map(r => new ReceiptDto(r));
  }
}