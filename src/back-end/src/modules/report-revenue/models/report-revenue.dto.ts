import { ApiProperty } from '@nestjs/swagger';
export class ReportRevenueTimeRangeDto {
  @ApiProperty({ type: Date })
  tu_ngay: Date;

  @ApiProperty({ type: Date })
  den_ngay: Date;
}
export class AgencyRevenueDto {
  @ApiProperty( { type: String, description: 'Unique identifier for the agency' })
  daily_id: string;

  @ApiProperty( { type: String, description: 'Name of the agency' })
  ten_daily: string;

  @ApiProperty( { type: Number, description: 'Total revenue for the agency' })
  tong_doanh_so: number;

  @ApiProperty( { type: Number, description: 'Percentage of total revenue' })
  ty_le_phan_tram: number;

  @ApiProperty(
    { type: () => ReportRevenueTimeRangeDto, description: 'Time range for the revenue report' }
  )
  thoi_gian : ReportRevenueTimeRangeDto;

  @ApiProperty({ type: Number, description: 'Number of export sheets for the agency', example: 5 })
  so_phieu_xuat_hang: number
}

export class ReportRevenueResponse {
  @ApiProperty({ type: [AgencyRevenueDto] })
  danh_sach_doanh_so: AgencyRevenueDto[];

  @ApiProperty()
  tong_doanh_so_he_thong: number;
}

