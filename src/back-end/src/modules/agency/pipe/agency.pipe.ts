import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { AgencyParams } from '../models/agency.params';
import parser from 'any-date-parser';

interface AgencyPipeInput {
  dien_thoai?: string;
  email?: string;
  tien_no?: string;
  ten?: string;
  loai_daily?: string;
  quan?: string;
  page?: string;
  perPage?: string;
  ngay_tiep_nhan?: string;
}

@Injectable()
export class AgencyPipe implements PipeTransform {
  transform(value: AgencyPipeInput): AgencyParams {
    const dateParsed = parser.fromString(value.ngay_tiep_nhan || '');
    return {
      tien_no: value.tien_no ? parseFloat(value.tien_no) : undefined,
      ten: value.ten,
      loai_daily: value.loai_daily || '',
      quan: value.quan || '',
      page: parseInt(value.page || '1'),
      perPage: parseInt(value.perPage || '10'),
      ngay_tiep_nhan: dateParsed.isValid() ? dateParsed : undefined,
    };
  }
}
