import { ApiProperty } from '@nestjs/swagger';

export class AgencyRevenueDto {
  @ApiProperty()
  daily_id: string;

  @ApiProperty()
  ten_daily: string;

  @ApiProperty()
  tong_doanh_so: number;

  @ApiProperty()
  ty_le_phan_tram: number;
}

export class ReportRevenueResponse {
  @ApiProperty({ type: [AgencyRevenueDto] })
  danh_sach_doanh_so: AgencyRevenueDto[];

  @ApiProperty()
  tong_doanh_so_he_thong: number;
} 