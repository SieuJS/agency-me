import { Controller, Get, Put, Param, Body, UseGuards, HttpException } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RegulationService } from '../service/regulation.service';
import { UpdateRegulationInput } from '../models/update-regulation.input';
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

  @Put()
  @ApiOperation({ summary: "Cập nhật quy định"})
  async update(
    @Body() input: UpdateRegulationInput,
  ) {
    try {
      return await this.regulationService.update(input);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }
}