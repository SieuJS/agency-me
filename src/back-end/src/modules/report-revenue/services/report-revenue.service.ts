import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { AgencyRevenueDto, ReportRevenueResponse, ReportRevenueTimeRangeDto } from '../models/report-revenue.dto';

@Injectable()
export class ReportRevenueService {
  constructor(private prisma: PrismaService) {}

  async generateRevenueReport(thoi_gian : ReportRevenueTimeRangeDto ): Promise<ReportRevenueResponse> {
    // Get all export sheets with their details
    const exportSheets = await this.prisma.phieuXuatHang.findMany({
      include: {
        chiTietPhieuXuat: true,
        daiLy: {
          select: {
            daily_id: true,
            ten: true,
          },
        },
      },
      where:{
        ngay_lap_phieu: {
          gte: thoi_gian.tu_ngay,
          lte: thoi_gian.den_ngay,
        },
      }
    });

    const agencyRevenues = new Map<string, AgencyRevenueDto>();

    exportSheets.forEach((sheet) => {
      const dailyId = sheet.daily_id;
      const dailyName = sheet.daiLy.ten;
      
      const totalRevenue = sheet.chiTietPhieuXuat.reduce(
        (sum, detail) => sum + detail.thanh_tien,
        0,
      );

      if (!agencyRevenues.has(dailyId)) {
        agencyRevenues.set(dailyId, {
          daily_id: dailyId,
          ten_daily: dailyName,
          tong_doanh_so: 0,
          ty_le_phan_tram: 0,
          thoi_gian,
        });
      }

      const currentAgency = agencyRevenues.get(dailyId);
      if (currentAgency) {
        currentAgency.tong_doanh_so += totalRevenue;
      }
    });

    // Calculate total system revenue
    const tongDoanhSoHeThong = Array.from(agencyRevenues.values()).reduce(
      (sum, agency) => sum + agency.tong_doanh_so,
      0,
    );

    // Calculate percentage for each agency
    agencyRevenues.forEach((agency) => {
      agency.ty_le_phan_tram = (agency.tong_doanh_so / tongDoanhSoHeThong) * 100;
    });

    // Sort agencies by revenue
    const sortedAgencies = Array.from(agencyRevenues.values()).sort(
      (a, b) => b.tong_doanh_so - a.tong_doanh_so,
    );

    return {
      danh_sach_doanh_so: sortedAgencies,
      tong_doanh_so_he_thong: tongDoanhSoHeThong,
    };
  }
} 