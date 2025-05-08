import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { AgencyTypeParams } from '../models/agencyType.params';

@Injectable()
export class AgencyTypePipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): AgencyTypeParams {
    return {
      ten_loai: value.ten_loai,
      tien_no_toi_da: parseFloat(value.tien_no_toi_da),
      page: parseInt(value.page) || 1,
      perPage: parseInt(value.perPage) || 10,
    };
  }
}