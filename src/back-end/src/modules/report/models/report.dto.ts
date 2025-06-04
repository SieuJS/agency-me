import { ApiProperty } from '@nestjs/swagger';

export class ReportDebtDto {
  @ApiProperty({ example: 'daily001' })
  daily_id: string;

  @ApiProperty({ example: 'Đại lý A' })
  ten: string;

  @ApiProperty({ example: 1000000 })
  no_dau: number;

  @ApiProperty({ example: 500000 })
  phat_sinh: number;

  @ApiProperty({ example: 1500000})
  tien_thu: number;

  @ApiProperty({ example: 1500000 })
  no_cuoi: number;
}