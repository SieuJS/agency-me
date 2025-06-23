import { PipeTransform, Injectable } from '@nestjs/common';
import { ExportSheetParams } from '../models/export-sheet.params';
import parser from 'any-date-parser';

@Injectable()
export class ExportSheetParamsPipe
  implements PipeTransform<any, ExportSheetParams>
{
  transform(value: any): ExportSheetParams {
    const date = value.ngay_tao;
    const dateValue = date ? parser.fromAny(date) : undefined;
    return (value = {
      ...value,
      page: value.page ? Number(value.page) : 1,
      limit: value.limit ? Number(value.limit) : 10,
      tong_tien: value.tong_tien ? Number(value.tong_tien) : 0,
      ngay_tao: dateValue?.isValid() ? dateValue : undefined,
      search: value.search ? String(value.search) : '',
    });
  }
}
