import { ApiProperty } from '@nestjs/swagger';
import { AgencyTypeDto } from './agencyType.dto';

export class CreateAgencyTypeResponse {
  @ApiProperty({
    example: 'Agency type created successfully',
    description: 'Message indicating the result of the operation',
  })
  message: string;

  @ApiProperty({
    type: AgencyTypeDto,
    description: 'The created agency type',
  })
  agencyType: AgencyTypeDto;
}