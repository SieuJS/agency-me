import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min, Max } from 'class-validator';

export class ReportDebtInput {
  @ApiProperty({ example: 5, description: 'Tháng' })
  @IsInt()
  @Min(1)
  @Max(12)
  month: number;

  @ApiProperty({ example: 2024, description: 'Năm' })
  @IsInt()
  year: number;
}