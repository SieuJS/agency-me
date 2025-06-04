import { ExportSheetListItemResponse } from './export-sheet-list.response';
import { DetailExportSheetsDto } from './detail-export-sheets.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class DetailExportSheetsResponse extends ExportSheetListItemResponse {
  @ApiProperty({
    description: 'List of items',
    type: [DetailExportSheetsDto],
  })
  items: DetailExportSheetsDto[];

  constructor(dbInstance: Prisma.PhieuXuatHangGetPayload<DbInclude>) {
    super(dbInstance);
    this.items = dbInstance.chiTietPhieuXuat.map((item) => {
      return new DetailExportSheetsDto(item);
    });
  }
}

export type DbInclude = {
  include: {
    nhanVien: true;
    daiLy: true;
    chiTietPhieuXuat: {
      include: {
        matHang: {
          include: {
            donViTinh: true;
          };
        };
      };
    };
  };
};
