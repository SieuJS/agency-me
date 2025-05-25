import { Controller, Post, Body, UseGuards, Get, Query, Req } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { ReceiptService } from '../service/receipt.service';
import { CreateReceiptInput } from '../models/receipt.input';
import { AuthGuard } from '@nestjs/passport';
import { ReceiptParams } from '../models/receipt.params';
import { ReceiptDto } from '../models/receipt.dto';
import { AuthPayloadDto } from 'src/modules/auth/models/auth-payload.dto';

@Controller('receipts')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token') 
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  async create(@Body() input: CreateReceiptInput) {
    return this.receiptService.create(input);
  }

  @Get()
  async findAll(@Query() params: ReceiptParams): Promise<ReceiptDto[]> {
    return this.receiptService.findAll(params);
  }
}