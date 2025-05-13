import { ApiProperty } from '@nestjs/swagger';
import { AgencyDto } from './agency.dto';

export class AgencyDetailDto {
  @ApiProperty()
  agency: AgencyDto | null;
}