import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail } from 'class-validator';

export class RegisterInput {
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
  dien_thoai: string;

  @ApiProperty({ example: 'admin' })
  @IsString()
  loai_nhan_vien_id: string;

  @ApiProperty({ example: '123 Đường ABC, Quận 1, TP.HCM' })
  @IsString()
  dia_chi: string;
}

export class LoginInput {
  @ApiProperty({ example: 'user@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password' })
  @IsString()
  password: string;
}