import { ApiProperty } from '@nestjs/swagger';
import { ExportSheetsDto, ExportSheetsInclude } from './export-sheets.dto';
import { Prisma } from '@prisma/client';
import { PaginationDTO } from 'src/modules/common';

export class ExportSheetListResponse {
  @ApiProperty({
    description: 'List of export sheets',
    type: [ExportSheetsDto],
  })
  data: ExportSheetsDto[];
  @ApiProperty({
    type: PaginationDTO,
    description: 'Pagination information',
  })
  meta: PaginationDTO;
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
