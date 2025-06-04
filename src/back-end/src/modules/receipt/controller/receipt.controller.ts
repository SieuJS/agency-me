import { Controller, Post, Body, UseGuards, Get, Query, Req, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReceiptService } from '../service/receipt.service';
import { CreateReceiptInput } from '../models/receipt.input';
import { AuthGuard } from '@nestjs/passport';
import { ReceiptParams } from '../models/receipt.params';
import { ReceiptDto } from '../models/receipt.dto';

@Controller('receipts')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token') 
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  @ApiOperation({ summary: "Tạo phiếu thu"})
  async create(@Body() input: CreateReceiptInput, @Req() req) {
    // Lấy ID nhân viên từ JWT (req.user)
    const nhanVienId = req.user.nhan_vien_id;
    return this.receiptService.create(input, nhanVienId);
  }

  @Get()
  @ApiOperation({ summary: "Tìm phiếu thu"})
  async findAll(@Query() params: ReceiptParams): Promise<ReceiptDto[]> {
    return this.receiptService.findAll(params);
  }

  @Get(':phieu_thu_id')
  @ApiOperation({ summary: "Tìm phiếu thu theo id phiếu thu"})
  async findOne(@Param('phieu_thu_id') phieu_thu_id: string): Promise<ReceiptDto> {
    return this.receiptService.findOne(phieu_thu_id);
  }
}