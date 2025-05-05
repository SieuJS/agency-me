import { Controller, Get, Query, UsePipes, Body, Post, HttpException } from '@nestjs/common';
import { AgencyTypeService } from '../service/agencyType.service';
import { AgencyTypeParams } from '../models/agencyType.params';
import { ApiResponse, ApiBody } from '@nestjs/swagger';
import { AgencyTypeDto } from '../models/agencyType.dto';
import { AgencyTypePipe } from '../pipe/agencyType.pipe';
import { AgencyTypeInput } from '../models/agency-type.input';

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

  @Post('create')
  @ApiResponse({
    type: AgencyTypeDto,
    description: 'Create a new agency type',
  })
  @ApiBody({
    type: AgencyTypeInput,
    description: 'Agency type input data',
  })
  async createAgencyType(@Body() input: AgencyTypeInput) {
    try {
      const newAgencyType = await this.agencyTypeService.createAgencyType(input);
      return {
        message: 'Agency type created successfully',
        agencyType: newAgencyType,
      };
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}