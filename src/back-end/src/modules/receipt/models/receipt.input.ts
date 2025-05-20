import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateReceiptInput {
  @ApiProperty({ example: 'daily001' })
  @IsString()
  daily_id: string;

  @ApiProperty({ example: '2024-05-20' })
  @IsDateString()
  ngay_thu: string;

  @ApiProperty({ example: 1000000 })
  @IsNumber()
  so_tien_thu: number;

  @ApiProperty({ example: 'nv001' })
  @IsString()
  nhan_vien_thu_tien: string;
}