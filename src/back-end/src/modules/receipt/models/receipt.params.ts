import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { ReceiptDto } from './receipt.dto';

export class ReceiptParams extends PartialType(
  PickType(ReceiptDto, ['daily_id', 'ngay_thu', 'nhan_vien_thu_tien'])
) {
  @ApiProperty({
    example: 1,
    description: 'Page number',
    required: false,
  })
  page?: number;

  @ApiProperty({
    example: 10,
    description: 'Items per page',
    required: false,
  })
  perPage?: number;
}