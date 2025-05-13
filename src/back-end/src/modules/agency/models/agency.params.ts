import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { AgencyDto } from './agency.dto';

export class AgencyParams extends PartialType(
  PickType(AgencyDto, [
    'quan',
    'loai_daily',
    'tien_no',
    'ten',
    'ngay_tiep_nhan',
  ]),
) {
  @ApiProperty({
    example: '1',
    description: 'Page 1',
    required: false,
  })
  page?: number;

  @ApiProperty({
    example: '10',
    description: '10 items per page',
    required: false,
  })
  perPage?: number;
}
