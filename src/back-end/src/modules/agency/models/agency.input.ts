import { ApiProperty, OmitType } from '@nestjs/swagger';
import { AgencyDto } from './agency.dto';

export class AgencyInput extends OmitType(AgencyDto, ['daily_id']) {
  @ApiProperty({
    example: '1',
    description: 'ID of the agency',
  })
  loai_daily_id: string;
  @ApiProperty({
    example: '1',
    description: 'ID of the employee who received the agency',
  })
  quan_id: string;

  nhan_vien_tiep_nhan: string;
}
