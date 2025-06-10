import { Controller, Get, Put, Param, Body, UseGuards, HttpException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RegulationService } from '../service/regulation.service';
import { UpdateGeneralRegulationInput, UpdateMaxDebtInput } from '../models/update-regulation.input';
import { AuthGuard } from '@nestjs/passport';

@Controller('regulation')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token') 
export class RegulationController {
  constructor(private readonly regulationService: RegulationService) {}

  @Get()
  @ApiOperation({ summary: "Tìm tất cả quy định"})
  getAll() {
    return this.regulationService.getAll();
  }

  @Put('general')
  @ApiOperation({ summary: "Cập nhật quy định chung"})
  async update(
    @Body() input: UpdateGeneralRegulationInput,
  ) {
    try {
      return await this.regulationService.update_general(input);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }

  @Put('max_debt')
  @ApiOperation({ summary: "Cập nhật tiền nợ tối đa"})
  async update_max_debt(
    @Body() input: UpdateMaxDebtInput,
  ) {
    try {
      return await this.regulationService.update_max_debt(input);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }
}