import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { ExportSheetInput } from '../models/export-sheet.input';
import parser from 'any-date-parser';

@Injectable()
export class ExportSheetInputPipe implements PipeTransform<any, Promise<ExportSheetInput>> {
    async transform(value: any): Promise<ExportSheetInput> {
        const { daily_id, items } = value;

        if (!daily_id || !items) {
            throw new BadRequestException('Missing required fields');
        }
        value.items = items.map(item => {
            if (!item.mathang_id || !item.so_luong) {
                throw new BadRequestException('Missing required fields');
            }
            return {
                mathang_id: item.mathang_id,
                so_luong: parseFloat(item.so_luong),
            }
        });
        value.ngay_lap_phieu = parser.fromString(value.ngay_lap_phieu, 'vi');
        return value;
    }
}
