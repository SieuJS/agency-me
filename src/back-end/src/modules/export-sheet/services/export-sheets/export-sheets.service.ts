import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { PaginationService } from 'src/modules/common/services/pagination.service';
import { ExportSheetInput } from '../../models/export-sheet.input';
import { v4 as uuidv4 } from 'uuid';
import { ExportSheetListItemResponse } from '../../models/export-sheet-list.response';
import { DetailExportSheetsResponse } from '../../models/detail-export-sheets.response';
import { ExportSheetsDto } from '../../models/export-sheets.dto';

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
        items.map(async (item) => {
          // Validate matHang exists
          const matHang = await prisma.matHang.findUnique({
            where: {
              mathang_id: item.mathang_id,
            },
          });

          if (!matHang) {
            throw new NotFoundException(
              `Mat hang ${item.mathang_id} khong ton tai`,
            );
          }

          return prisma.chiTietPhieuXuat.create({
            data: {
              phieu_id: phieuXuat.phieu_id,
              mathang_id: item.mathang_id,
              so_luong: item.so_luong,
              don_gia: matHang.don_gia,
              thanh_tien: matHang.don_gia * item.so_luong,
            },
          });
        }),
      );

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

  async getListExportSheets(params: {
    page?: number;
    limit?: number;
    search?: string;
  }) {
    const { page = 1, limit = 10, search = '' } = params;

    const where = search
      ? {
          OR: [
            { phieu_id: { contains: search } },
            { daiLy: { ten: { contains: search } } },
            { nhanVien: { ten: { contains: search } } },
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
            matHang: true,
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
