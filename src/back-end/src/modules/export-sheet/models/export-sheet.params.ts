import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ExportSheetParams {
  @ApiProperty({
    description: 'Page number',
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number;

  @ApiProperty({
    description: 'Number of records per page',
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number;

  @ApiProperty({
    description: 'Search term',
    example: 'search term',
    required: false,
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    description: 'Created date',
    example: 'createdAt',
    required: false,
  })
  @IsOptional()
  @IsString()
  ngay_tao?: Date;

  @ApiProperty({
    description: 'Export sheet ID',
    example: 'exportSheetId',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  tong_tien?: number;
  
}
