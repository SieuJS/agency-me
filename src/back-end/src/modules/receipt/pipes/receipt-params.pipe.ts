import { PipeTransform, Injectable } from '@nestjs/common';
import { ReceiptParams } from '../models/receipt.params';
import parser from 'any-date-parser';

@Injectable()
export class ReceiptParamsPipe implements PipeTransform<any, ReceiptParams> {
  transform(value: any): ReceiptParams {
    const date = value.ngay_thu;
    const dateValue = date ? parser.fromAny(date) : undefined;
    return {
      ...value,
      page: value.page ? Number(value.page) : 1,
      perPage: value.perPage ? Number(value.perPage) : 10,
      so_tien_thu: value.so_tien_thu ? Number(value.so_tien_thu) : undefined,
      ngay_thu: dateValue?.isValid() ? dateValue : undefined,
      ten_dai_ly: value.ten_dai_ly ? String(value.ten_dai_ly) : undefined,
    };
  }
}