import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'yourPassword123' })
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
}

export class LoginDto {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'yourPassword123' })
  @IsString()
  password: string;
}