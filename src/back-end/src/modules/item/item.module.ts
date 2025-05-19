import { Module } from '@nestjs/common';
import { ItemController } from './controllers/item/item.controller';
import { ItemService } from './services/item/item.service';
import { CommonModule } from '../common';

@Module({
  imports: [CommonModule],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
