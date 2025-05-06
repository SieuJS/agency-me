import { ApiProperty } from '@nestjs/swagger';

export class DistrictDto {
  @ApiProperty({ example: '01' })
  districtId: string;

  @ApiProperty({ example: 'District 1' })
  name: string;

  @ApiProperty({ example: 'Ho Chi Minh City' })
  city: string;

  @ApiProperty({ example: 4 })
  maxAgencies: number;
}