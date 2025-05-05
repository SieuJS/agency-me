import { Controller, Get, Query, UsePipes, Body, Post, HttpException, Delete } from '@nestjs/common';
import { AgencyTypeService } from '../service/agencyType.service';
import { AgencyTypeParams } from '../models/agencyType.params';
import { ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
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

  @Delete('delete')
  @ApiResponse({
    type: Object,
    description: 'Delete an agency type by ID',
  })
  @ApiQuery({
    name: 'loai_daily_id',
    type: String,
    description: 'ID of the agency type to delete',
    required: true,
  })
  async deleteAgencyType(@Query('loai_daily_id') loai_daily_id: string) {
    try {
      const result = await this.agencyTypeService.deleteAgencyType(loai_daily_id);
      return result;
    } catch (error) {
      throw new HttpException(error.message, 400);
    }
  }
}