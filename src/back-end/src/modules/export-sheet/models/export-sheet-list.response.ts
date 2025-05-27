import { ApiProperty } from '@nestjs/swagger';
import { ExportSheetsDto, ExportSheetsInclude } from './export-sheets.dto';
import { Prisma } from '@prisma/client';

export class ExportSheetListResponse {
  @ApiProperty({
    description: 'Total number of records',
    example: 100,
  })
  total: number;

  @ApiProperty({
    description: 'Current page number',
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
  })
  limit: number;

  @ApiProperty({
    description: 'List of export sheets',
    type: [ExportSheetsDto],
  })
  data: ExportSheetsDto[];
}

export class ExportSheetListItemResponse extends ExportSheetsDto {
  @ApiProperty({
    description: 'Total money of export sheet',
    example: 100,
  })
  tong_tien: number;

  constructor(
    dbInstance: Prisma.PhieuXuatHangGetPayload<ItemDetailExportSheetsInclude>,
  ) {
    super(dbInstance);
    this.tong_tien = dbInstance.chiTietPhieuXuat.reduce(
      (acc, curr) => acc + curr.thanh_tien,
      0,
    );
  }
}

export type ItemDetailExportSheetsInclude = ExportSheetsInclude & {
  include: {
    chiTietPhieuXuat: {
      include: {
        matHang: true;
      };
    };
  };
};
