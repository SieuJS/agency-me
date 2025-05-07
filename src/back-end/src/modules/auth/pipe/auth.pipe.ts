import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { RegisterDto } from '../models/auth.dto';

@Injectable()
export class AuthPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): RegisterDto {

    return {
      email: value.email,
      password: value.password,
      ten: value.ten,
      dienThoai: value.dienThoai,
      loaiNhanVienId: value.loaiNhanVienId,
      diaChi: value.diaChi,
    };
  }
}