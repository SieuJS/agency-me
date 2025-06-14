import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { ItemDto, ItemSearchParams } from '../../models/item.dto';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async findWithPattern(query : ItemSearchParams): Promise<ItemDto[]> {
    const { pattern, unit } = query;
    const items = await this.prisma.matHang.findMany({
      where: {
        ten: { contains: pattern, mode: 'insensitive' },
        donViTinh: unit ? { ten_don_vi: { contains: unit, mode: 'insensitive' } } : undefined,
      },
      include: {
        donViTinh: true,
      },
    });
    return items.map((item) => new ItemDto(item));
  }
}
