import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsDate, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ExportSheetsDto {
  @ApiProperty({
    description: 'The ID of the export sheet',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  phieu_id: string;

  @ApiProperty({
    description: 'The name of agency',
    example: 'Công ty TNHH Đại Lý Hàng Hóa',
  })
  @IsString()
  @IsNotEmpty()
  daily_name: string;

  @ApiProperty({
    description: 'The date of export sheet',
    example: '2021-01-01',
  })
  @IsDate()
  @IsNotEmpty()
  ngay_lap_phieu: Date;

  @ApiProperty({
    description: 'Nhan vien lap phieu',
    example: 'Nguyen Van A',
  })
  @IsString()
  @IsNotEmpty()
  nhan_vien_lap_phieu: string;

  constructor(dbIstance: Prisma.PhieuXuatHangGetPayload<ExportSheetsInclude>) {
    this.phieu_id = dbIstance.phieu_id;
    this.daily_name = dbIstance.daiLy.ten;
    this.ngay_lap_phieu = dbIstance.ngay_lap_phieu;
    this.nhan_vien_lap_phieu = dbIstance.nhanVien.ten;
  }
}

export type ExportSheetsInclude = {
  include: {
    daiLy: true;
    nhanVien: true;
  };
};
