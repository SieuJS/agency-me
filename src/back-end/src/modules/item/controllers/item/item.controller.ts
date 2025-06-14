import { Controller, Get, Query } from '@nestjs/common';
import { ItemService } from '../../services/item/item.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ItemDto, ItemSearchParams } from '../../models/item.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Get()
  @ApiQuery({
    name: 'pattern',
    type: String,
    example: '',
    required: false,
  })
  @ApiResponse({
    status: 200,
    description: 'The items have been successfully fetched.',
    type: ItemDto,
    isArray: true,
  })
  @ApiResponse({
    status: 400,
    description: 'The pattern is invalid.',
  })
  async findWithPattern(@Query() query : ItemSearchParams): Promise<ItemDto[]> {
    return this.itemService.findWithPattern(query);
  }
}
