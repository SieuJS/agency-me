import { Injectable, PipeTransform } from '@nestjs/common';
import { RegisterDto } from '../models/auth.dto';

@Injectable()
export class AuthPipe implements PipeTransform {
  transform(value: Partial<RegisterDto>): RegisterDto {
    if (
      !value.email ||
      !value.password ||
      !value.ten ||
      !value.dienThoai ||
      !value.loaiNhanVienId ||
      !value.diaChi
    ) {
      throw new Error('Missing required fields');
    }

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
