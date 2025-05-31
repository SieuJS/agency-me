import { Module } from '@nestjs/common';
import { ReceiptController } from './controller/receipt.controller';
import { ReceiptService } from './service/receipt.service';
import { CommonModule } from '../common';

@Module({
  imports: [CommonModule],
  controllers: [ReceiptController],
  providers: [ReceiptService],
  exports: [ReceiptService],
})
export class ReceiptModule {}