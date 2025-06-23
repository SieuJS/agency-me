import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { ReportDebtInput } from '../models/report.input';
import { ReportDebtDto } from '../models/report.dto';

@Injectable()
export class ReportService {
  constructor(private readonly prisma: PrismaService) {}

  async calcDebt(input: ReportDebtInput): Promise<ReportDebtDto[]> {
    const { month, year } = input;

    // Lấy tất cả đại lý
    const daiLys = await this.prisma.daiLy.findMany();

    // Tính toán cho từng đại lý
    const reports: ReportDebtDto[] = [];
    for (const daiLy of daiLys) {
      const startDate = new Date(year, month,-1, 1); // Ngày đầu tháng
      const endDate = new Date(year, month, 0);
      console.log(`Calculating debt for agency: ${daiLy.ten} (${daiLy.daily_id}) from ${startDate.toDateString()} to ${endDate.toDateString()}`);
      // Tổng thu tiền trong tháng
      const thuTien = await this.prisma.phieuThuTien.aggregate({
        where: {
          daily_id: daiLy.daily_id,
          ngay_thu: { gte: startDate, lte: endDate },
        },
        _sum: { so_tien_thu: true },
      });

      // Tổng phát sinh trong tháng
      const phieuXuatList = await this.prisma.phieuXuatHang.findMany({
        where: {
          daily_id: daiLy.daily_id,
          ngay_lap_phieu: { gte: startDate, lte: endDate },
        },
        select: { phieu_id: true },
      });
      let phat_sinh = 0;
      if (phieuXuatList.length > 0) {
        const phieuIds = phieuXuatList.map(p => p.phieu_id);
        const chiTietAgg = await this.prisma.chiTietPhieuXuat.aggregate({
          where: { phieu_id: { in: phieuIds } },
          _sum: { thanh_tien: true },
        });
        phat_sinh = chiTietAgg._sum.thanh_tien || 0;
      }

      // Tổng phát sinh trước tháng này
      const phieuXuatTruoc = await this.prisma.phieuXuatHang.findMany({
        where: {
          daily_id: daiLy.daily_id,
          ngay_lap_phieu: { lt: startDate,  },
        },
        select: { phieu_id: true },
      });
      let phat_sinh_truoc = 0;
      if (phieuXuatTruoc.length > 0) {
        const phieuIdsTruoc = phieuXuatTruoc.map(p => p.phieu_id);
        const chiTietAggTruoc = await this.prisma.chiTietPhieuXuat.aggregate({
          where: { phieu_id: { in: phieuIdsTruoc } },
          _sum: { thanh_tien: true },
        });
        phat_sinh_truoc = chiTietAggTruoc._sum.thanh_tien || 0;
      }

      // Tổng thu tiền trước tháng này
      const thuTienTruoc = await this.prisma.phieuThuTien.aggregate({
        where: {
          daily_id: daiLy.daily_id,
          ngay_thu: { lt: startDate },
        },
        _sum: { so_tien_thu: true },
      });

      // Nợ đầu tháng = tổng phát sinh trước tháng - tổng thu tiền trước tháng
      const no_dau = phat_sinh_truoc - (thuTienTruoc._sum.so_tien_thu || 0);

      // Nợ cuối tháng = nợ đầu + phát sinh trong tháng - thu tiền trong tháng
      const tien_thu = thuTien._sum.so_tien_thu || 0;
      const no_cuoi = no_dau + phat_sinh - tien_thu;

      reports.push({
        daily_id: daiLy.daily_id,
        ten: daiLy.ten,
        no_dau,
        phat_sinh,
        tien_thu,
        no_cuoi,
      });
    }

    return reports;
  }
}