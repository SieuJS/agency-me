import { Controller, Get } from '@nestjs/common';
import { DistrictService } from '../service/district.service';
import { DistrictDto } from '../models/district.dto';

@Controller('districts')
export class DistrictController {
  constructor(private readonly districtService: DistrictService) {}

  @Get()
  async getAll(): Promise<DistrictDto[]> {
    return this.districtService.findAll();
  }
}