import { Controller, Get, Query, UsePipes, Body, Post, HttpException, Delete } from '@nestjs/common';
import { AgencyTypeService } from '../service/agencyType.service';
import { AgencyTypeParams } from '../models/agencyType.params';
import { ApiResponse, ApiBody, ApiQuery } from '@nestjs/swagger';
import { AgencyTypeDto } from '../models/agencyType.dto';
import { AgencyTypePipe } from '../pipe/agencyType.pipe';
import { AgencyTypeInput } from '../models/agencyType.input';
import { CreateAgencyTypeResponse } from '../models/create-agencyType.response';
import { AgencyTypeListResponse } from '../models/list-agencyType.response';
import { DeleteAgencyTypeResponse } from '../models/delete-agencyType.response';

@Controller('agencyType')
export class AgencyTypeController {
  constructor(private readonly agencyTypeService: AgencyTypeService) {}

  @Get('list')
  @ApiResponse({
    type: AgencyTypeListResponse,
    description: 'List of agency types with pagination',
    // isArray: true,
  })
  getAgencyTypeList(@Query(new AgencyTypePipe()) params: AgencyTypeParams) {
    return this.agencyTypeService.getListAgencyTypes(params);
  }

  @Post('create')
  @ApiResponse({
    type: CreateAgencyTypeResponse,
    description: 'Create a new agency type',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Agency type with this name already exists',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Agency type with this name already exists',
        },
      },
    },
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
    type: DeleteAgencyTypeResponse,
    description: 'Delete an agency type by ID',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Agency type not found or in use',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Agency type not found',
        },
      },
    },
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