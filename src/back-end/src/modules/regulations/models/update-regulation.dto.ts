import { ApiProperty } from '@nestjs/swagger';

export class RegulationDto {
    @ApiProperty({ example: 'maxAgencies', description: 'Regulation key' })
    key: string;

    @ApiProperty({ example: 100, description: 'Regulation value' })
    value: number;

    @ApiProperty({ example: 'Số lượng đại lý tối đa', description: 'Description' })
    description: string;

    constructor(partial: Partial<RegulationDto>) {
      Object.assign(this, partial);
    }
  }