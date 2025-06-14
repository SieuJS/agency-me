import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { IsNotEmpty } from 'class-validator';
import { IsUUID } from 'class-validator';
import { Prisma } from '@prisma/client';

export class ItemDto {
  @ApiProperty({
    description: 'The ID of the item',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  mathang_id: string;

  @ApiProperty({
    description: 'The name of the item',
    example: 'Item 1',
  })
  @IsString()
  @IsNotEmpty()
  ten: string;

  @ApiProperty({
    description: 'The price of the item',
    example: 100,
  })
  @IsNumber()
  @IsNotEmpty()
  don_gia: number;

  @ApiProperty({
    description: 'The quantity of the item',
    example: 'Cái',
  })
  @IsString()
  @IsNotEmpty()
  don_vi_tinh: string;

  constructor(dbInstance: Prisma.MatHangGetPayload<ItemInclude>) {
    this.mathang_id = dbInstance.mathang_id;
    this.ten = dbInstance.ten;
    this.don_gia = dbInstance.don_gia;
    this.don_vi_tinh = dbInstance.donViTinh.ten_don_vi;
  }
}

export class ItemSearchParams{
  @ApiProperty({
    description: 'Search pattern for item name',
    example: 'Item',
    required: false,
  })
  pattern?: string;

  @ApiProperty({
    description: 'Unit of the item',
    example: 'Cái',
    required: false,
  })
  unit?: string;
}

export type ItemInclude = {
  include: {
    donViTinh: true;
  };
};
