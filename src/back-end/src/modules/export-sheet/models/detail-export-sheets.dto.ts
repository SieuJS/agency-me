import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ItemDto } from 'src/modules/item/models/item.dto';

export class DetailExportSheetsDto extends ItemDto {
  @ApiProperty({
    description: 'Mã số hàng hóa',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  phieu_id: string;

  @ApiProperty({
    description: 'So luong',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  so_luong: number;

  @ApiProperty({
    description: 'Thanh tien',
    example: 10,
  })
  @IsNumber()
  @IsNotEmpty()
  thanh_tien: number;

  constructor(
    dbInstance: Prisma.ChiTietPhieuXuatGetPayload<DetailExportSheetsInclude>,
  ) {
    super(dbInstance.matHang);
    this.phieu_id = dbInstance.phieu_id;
    this.so_luong = dbInstance.so_luong;
    this.thanh_tien = dbInstance.thanh_tien;
  }
}

export type DetailExportSheetsInclude = {
  include: {
    matHang: {
      include: {
        donViTinh: true;
      };
    };
  };
};
