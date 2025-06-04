import { ApiProperty } from '@nestjs/swagger';
import { PhieuThuTien } from '@prisma/client';

export class ReceiptDto {
  @ApiProperty({ example: 'pt001' })
  phieu_thu_id: string;

  @ApiProperty({ example: 'daily001' })
  daily_id: string;

  @ApiProperty({ example: '2024-05-20' })
  ngay_thu: Date;

  @ApiProperty({ example: 1000000 })
  so_tien_thu: number;

  constructor(dbInstance: PhieuThuTien) {
    this.phieu_thu_id = dbInstance.phieu_thu_id;
    this.daily_id = dbInstance.daily_id;
    this.ngay_thu = dbInstance.ngay_thu;
    this.so_tien_thu = dbInstance.so_tien_thu;
  }
}