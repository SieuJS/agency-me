import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { PaginationService } from 'src/modules/common/services/pagination.service';
import { ExportSheetInput } from '../../models/export-sheet.input';
import { v4 as uuidv4 } from 'uuid';
import { DetailExportSheetsResponse } from '../../models/detail-export-sheets.response';
import { ExportSheetsDto } from '../../models/export-sheets.dto';
import { ExportSheetParams } from '../../models/export-sheet.params';

@Injectable()
export class ExportSheetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService<ExportSheetsDto>,
  ) {}

  async createExportSheet(input: ExportSheetInput) {
    const { daily_id, nhan_vien_lap_phieu, items } = input;

    // Validate daily exists
    const daily = await this.prisma.daiLy.findUnique({
      where: {
        daily_id: daily_id,
      },
      include: {
        loaiDaiLy: true, // Include loaiDaiLy to check tien_no_toi_da
      }
    });

    if (!daily) {
      throw new NotFoundException('Dai ly khong ton tai');
    }

    // Validate nhanVien exists
    const nhanVien = await this.prisma.nhanVien.findUnique({
      where: {
        nhan_vien_id: nhan_vien_lap_phieu,
      },
    });

    if (!nhanVien) {
      throw new NotFoundException('Nhan vien khong ton tai');
    }

    // Calculate totalThanhTien by fetching don_gia from matHang
    const itemDetails = await Promise.all(
      items.map(async (item) => {
        const matHang = await this.prisma.matHang.findUnique({
          where: {
            mathang_id: item.mathang_id,
          },
        });

        if (!matHang) {
          throw new NotFoundException(`Mat hang ${item.mathang_id} khong ton tai`);
        }

        const don_gia = matHang.don_gia || 0;
        if (don_gia <= 0) {
          throw new BadRequestException(`Don gia cua mat hang ${item.mathang_id} khong hop le`);
        }

        return {
          mathang_id: item.mathang_id,
          so_luong: item.so_luong,
          don_gia: don_gia,
          thanh_tien: don_gia * item.so_luong,
        };
      }),
    );

    const totalThanhTien = itemDetails.reduce((sum, item) => sum + item.thanh_tien, 0);

    // Check if total debt (tien_no + thanh_tien) exceeds tien_no_toi_da
    const currentTienNo = daily.tien_no || 0;
    const maxTienNo = daily.loaiDaiLy.tien_no_toi_da || Infinity; // Default to Infinity if not set
    if (currentTienNo + totalThanhTien > maxTienNo) {
      throw new BadRequestException(`Tong no (${currentTienNo + totalThanhTien}) vuot qua gioi han no toi da (${maxTienNo}) cua loai dai ly`);
    }

    return await this.prisma.$transaction(async (prisma) => {
      const phieuXuat = await prisma.phieuXuatHang.create({
        data: {
          phieu_id: uuidv4(),
          daily_id: daily_id,
          nhan_vien_lap_phieu: nhan_vien_lap_phieu,
          ngay_lap_phieu: new Date(),
        },
      });

      const chiTietPhieuXuat = await Promise.all(
        itemDetails.map((item) =>
          prisma.chiTietPhieuXuat.create({
            data: {
              phieu_id: phieuXuat.phieu_id,
              mathang_id: item.mathang_id,
              so_luong: item.so_luong,
              don_gia: item.don_gia,
              thanh_tien: item.thanh_tien,
            },
          }),
        ),
      );

      // Update tien_no of daiLy after successful creation
      await prisma.daiLy.update({
        where: { daily_id: daily_id },
        data: {
          tien_no: {
            increment: totalThanhTien, // Increase tien_no by totalThanhTien
          },
        },
      });

      return {
        ...phieuXuat,
        chiTietPhieuXuat,
      };
    });
  }

  async getExportSheetById(id: string) {
    const phieuXuat = await this.prisma.phieuXuatHang.findUnique({
      where: { phieu_id: id },
      include: {
        daiLy: true,
        nhanVien: true,
        chiTietPhieuXuat: {
          include: {
            matHang: {
              include: {
                donViTinh: true,
              },
            },
          },
        },
      },
    });

    if (!phieuXuat) {
      throw new NotFoundException('Phieu xuat khong ton tai');
    }

    return new DetailExportSheetsResponse(phieuXuat);
  }

  async getListExportSheets(params: ExportSheetParams) {
    const { page = 1, limit = 10, search, ngay_tao, tong_tien } = params;

    const where = search
      ? {
          AND: [
            { phieu_id: { contains: search } },
            { daiLy: { ten: { contains: search } } },
            { nhanVien: { ten: { contains: search } } },
            { ngay_tao: ngay_tao ? { gte: ngay_tao } : undefined },
            { chiTietPhieuXuat: { some: { thanh_tien: tong_tien ? { gte: tong_tien } : undefined } } },
          ],
        }
      : {};

    const rawResult = await this.prisma.phieuXuatHang.findMany({
      where,
      include: {
        daiLy: true,
        nhanVien: true,
        chiTietPhieuXuat: {
          include: {
            matHang: {
              include: {
                donViTinh: true,
              },
            }
          },
        },
      },
      orderBy: {
        ngay_lap_phieu: 'desc',
      },
    });

    const response = this.paginationService.paginate(
      rawResult.map((item) => new ExportSheetsDto(item)),
      page,
      limit,
    );

    return response;
  }
}
