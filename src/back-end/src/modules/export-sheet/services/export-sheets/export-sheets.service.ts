import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { ExportSheetInput } from '../../models/export-sheet.input';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ExportSheetsService {
    constructor(private readonly prisma: PrismaService) {}

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

        // Create phieu xuat with its items in a transaction
        return await this.prisma.$transaction(async (prisma) => {
            // Create phieu xuat
            const phieuXuat = await prisma.phieuXuatHang.create({
                data: {
                    phieu_id: uuidv4(),
                    daily_id: daily_id,
                    nhan_vien_lap_phieu: nhan_vien_lap_phieu,
                    ngay_lap_phieu: new Date(),
                },
            });

            // Create chi tiet phieu xuat for each item
            const chiTietPhieuXuat = await Promise.all(
                items.map(async (item) => {
                    // Validate matHang exists
                    const matHang = await prisma.matHang.findUnique({
                        where: {
                            mathang_id: item.mathang_id,
                        },
                    });

                    if (!matHang) {
                        throw new NotFoundException(`Mat hang ${item.mathang_id} khong ton tai`);
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
                })
            );

            return {
                ...phieuXuat,
                chiTietPhieuXuat,
            };
        });
    }
}
