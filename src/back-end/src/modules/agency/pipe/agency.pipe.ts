import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { AgencyParams } from '../models/agency.params';
import parser from 'any-date-parser';

@Injectable()
export class AgencyPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) : AgencyParams{
    const dateParsed = parser.fromString(value.ngay_tiep_nhan);
    
    return {
      dien_thoai: value.dien_thoai,
      email: value.email,
      tien_no: parseFloat(value.tien_no),
      ten: value.ten,
      page: parseInt(value.page) || 1,
      perPage: parseInt(value.perPage) || 10,
      ngay_tiep_nhan : dateParsed.isValid() ? dateParsed : undefined
    }
  }
}
