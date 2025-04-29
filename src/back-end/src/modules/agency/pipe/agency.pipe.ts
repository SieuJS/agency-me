import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { AgencyParams } from '../models/agency.params';
import parser from 'any-date-parser';

@Injectable()
export class AgencyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) : AgencyParams{
    return {
      dien_thoai: value.dien_thoai,
      email: value.email,
      tien_no: parseFloat(value.tien_no),
      ten: value.ten,
      ngay_tiep_nhan : parser.fromString(value.ngay_tiep_nhan)
    }
  }
}
