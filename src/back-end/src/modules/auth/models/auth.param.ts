import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterParam {
  @ApiProperty({ example: 'nv001' })
  @IsString()
  nhan_vien_id: string;
}