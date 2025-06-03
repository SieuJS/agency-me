import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ExportSheetInput } from '../models/export-sheet.input';
import parser from 'any-date-parser';

@Injectable()
export class ExportSheetInputPipe
  implements PipeTransform<any, ExportSheetInput>
{
  transform(value: ExportSheetInput): ExportSheetInput {
    const { daily_id, items } = value;

    if (!daily_id || !items) {
      throw new BadRequestException('Missing required fields');
    }
    value.items = items.map((item) => {
      if (!item.mathang_id || !item.so_luong) {
        throw new BadRequestException('Missing required fields');
      }
      return {
        mathang_id: item.mathang_id,
        so_luong: parseFloat(item.so_luong as unknown as string),
      };
    });
    value.ngay_lap_phieu = parser.fromString(
      value.ngay_lap_phieu as unknown as string,
      'vi',
    );
    return value;
  }
}
