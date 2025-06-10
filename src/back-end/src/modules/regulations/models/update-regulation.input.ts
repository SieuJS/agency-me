import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class UpdateGeneralRegulationInput {
  @ApiProperty({ example: 'so_luong_cac_loai_daily', description: 'Regulation key' })
  @IsString()
  key: string;

  @ApiProperty({ example: 10, description: 'Giá trị mới của quy định' })
  @IsNumber()
  @Min(0, { message: 'Giá trị phải lớn hơn hoặc bằng 0' })
  value: number;
}

export class UpdateMaxDebtInput {
  @ApiProperty({ example: 'loai001', description: 'Loại đại lý id'})
  @IsString()
  loai_daily_id: string;

  @ApiProperty({ example: 10, description: 'Giá trị mới của quy định' })
  @IsNumber()
  @Min(0, { message: 'Giá trị phải lớn hơn hoặc bằng 0' })
  value: number;
}