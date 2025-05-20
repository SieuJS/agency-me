import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ReceiptService } from '../service/receipt.service';
import { CreateReceiptInput } from '../models/receipt.input';
import { AuthGuard } from '@nestjs/passport';

@Controller('receipts')
@UseGuards(AuthGuard('jwt')) // Chỉ cho phép nhân viên đã đăng nhập
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  async create(@Body() input: CreateReceiptInput) {
    return this.receiptService.create(input);
  }
}