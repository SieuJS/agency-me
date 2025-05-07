import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';
import { NhanVien } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'Nguyễn Văn A' })
  @IsString()
  ten: string;

  @ApiProperty({ example: '0912345678' })
  @IsString()
  dienThoai: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  loaiNhanVienId: string;

  @ApiProperty({ example: '123 Đường ABC, Quận 1, TP.HCM' })
  @IsString()
  diaChi: string;

  constructor(dbInstance: NhanVien) {
    this.email = dbInstance.email;
    this.password = dbInstance.mat_khau;
    this.ten = dbInstance.ten;
    this.dienThoai = dbInstance.dien_thoai;
    this.loaiNhanVienId = dbInstance.loai_nhan_vien_id;
    this.diaChi = dbInstance.dia_chi;
  }
}

export class LoginDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  password: string;

  constructor(dbInstance: NhanVien) {
    this.email = dbInstance.email;
    this.password = dbInstance.mat_khau;
  }
}