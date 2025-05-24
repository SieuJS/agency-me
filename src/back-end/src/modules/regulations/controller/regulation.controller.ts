import { Controller, Get, Put, Param, Body, UseGuards, HttpException } from '@nestjs/common';
import { RegulationService } from '../service/regulation.service';
import { UpdateRegulationInput } from '../models/update-regulation.input';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/modules/auth/guards/roles.guard';

@Controller('regulation')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class RegulationController {
  constructor(private readonly regulationService: RegulationService) {}

  @Get()
  getAll() {
    return this.regulationService.getAll();
  }

  @Put(':type')
  async update(
    @Param('type') type: string,
    @Body() input: UpdateRegulationInput,
  ) {
    try {
      return await this.regulationService.update(type, input.value, input);
    } catch (e) {
      throw new HttpException(e.message, 400);
    }
  }
}