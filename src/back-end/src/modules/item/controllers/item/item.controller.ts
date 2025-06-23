import { Body, Controller, Get, Param, Put, Query, UsePipes } from '@nestjs/common';
import { ItemService } from '../../services/item/item.service';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ItemDto, ItemSearchParams, ItemUpdateDto } from '../../models/item.dto';
import { UpdateItemPipe } from '../../pipes/update-item.pipe';

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

  @Put(':id')
  @ApiResponse({
    status: 200,
    description: 'The item has been successfully updated.',
    type: ItemUpdateDto,
  })
  async updateItem(@Param('id') id: string, @Body(UpdateItemPipe) body: ItemUpdateDto): Promise<ItemDto> {
    return this.itemService.updateItem(id, body);
  }
}
