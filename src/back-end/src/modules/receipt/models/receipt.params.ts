import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { ReceiptDto } from './receipt.dto';

export class ReceiptParams extends PartialType(
  PickType(ReceiptDto, ['ngay_thu'])
) {
  @ApiProperty({
    example: "ABCD",
    description: 'Tên đại lý',
    required: false,
  })
  ten_dai_ly?: string;

  @ApiProperty({
    example: "ABCD",
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