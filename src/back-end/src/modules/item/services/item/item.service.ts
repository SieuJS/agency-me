import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { ItemDto } from '../../models/item.dto';

@Injectable()
export class ItemService {
  constructor(private readonly prisma: PrismaService) {}

  async findWithPattern(pattern: string): Promise<ItemDto[]> {
    const items = await this.prisma.matHang.findMany({
      where: {
        ten: { contains: pattern, mode: 'insensitive' },
      },
      include: {
        donViTinh: true,
      },
    });
    return items.map((item) => new ItemDto(item));
  }
}
