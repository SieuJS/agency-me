import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegulationParams {
  @ApiProperty({ example: 'so_luong_cac_loai_daily', description: 'Regulation key' })
  @IsString()
  key: string;
}