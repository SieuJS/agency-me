import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import parser from 'any-date-parser';

@Injectable()
export class RevenueTimePipe implements PipeTransform {
    transform(value: any) {
        if (!value || !value.tu_ngay || !value.den_ngay) {
            throw new BadRequestException('Invalid time range provided');
        }

        const tuNgay = parser.fromAny(value.tu_ngay);
        const denNgay = parser.fromAny(value.den_ngay);

        if (!tuNgay.isValid() || !denNgay.isValid()) {
            throw new BadRequestException('Invalid date format');
        }

        if (tuNgay > denNgay) {
            throw new BadRequestException('Start date cannot be after end date');
        }

        return {
            tu_ngay: tuNgay,
            den_ngay: denNgay,
        };
    }
}