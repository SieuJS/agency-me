import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { ReceiptDto } from './receipt.dto';

export class ReceiptParams extends PartialType(
  PickType(ReceiptDto, ['daily_id', 'ngay_thu'])
) {
  @ApiProperty({
    example: "nv001",
    description: 'Nhân viên thu tiền',
    required: false,
  })
  nhan_vien_thu_tien?: string;

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