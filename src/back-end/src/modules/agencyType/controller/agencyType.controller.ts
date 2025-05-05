import { Controller, Get, Query, UsePipes } from '@nestjs/common';
import { AgencyTypeService } from '../service/agencyType.service';
import { AgencyTypeParams } from '../models/agencyType.params';
import { ApiResponse } from '@nestjs/swagger';
import { AgencyTypeDto } from '../models/agencyType.dto';
import { AgencyTypePipe } from '../pipe/agencyType.pipe';

@Controller('agencyType')
export class AgencyTypeController {
  constructor(private readonly agencyTypeService: AgencyTypeService) {}

  @Get('list')
  @ApiResponse({
    type: AgencyTypeDto,
    isArray: true,
  })
  getAgencyTypeList(@Query(new AgencyTypePipe()) params: AgencyTypeParams) {
    return this.agencyTypeService.getListAgencyTypes(params);
  }
}