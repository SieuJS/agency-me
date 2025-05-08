import {
  Body,
  Controller,
  Get,
  HttpException,
  Post,
  Query,
} from '@nestjs/common';
import { AgencyService } from '../service/agency.service';
import { AgencyParams } from '../models/agency.params';
import { ApiBody, ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { AgencyDto } from '../models/agency.dto';
import { AgencyPipe } from '../pipe/agency.pipe';
import { AgencyInput } from '../models/agency.input';
import { AgencyListResponse } from '../models/agency-list.response';
import { AgencyTypeParams } from 'src/modules/agencyType/models/agencyType.params';

@Controller('agency')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Get('list')
  @ApiResponse({
    type: AgencyListResponse,
  })
  @ApiQuery({
    type: AgencyParams,
  })
  getAgencyList(@Query(new AgencyPipe()) params: AgencyParams) {
    return this.agencyService.getListAngencies(params);
  }

  @Post('create')
  @ApiResponse({
    type: AgencyDto,
    description: 'Create a new agency',
  })
  @ApiBody({
    type: AgencyInput,
    description: 'Agency input data',
  })
  async createAgency(@Body() input: AgencyInput) {
    try {
      const newAgency = await this.agencyService.createAgency(input);
      return {
        message: 'Agency created successfully',
        agency: newAgency,
      };
    } catch (error) {
      throw new HttpException(
        (error as Error).message || 'An error occurred',
        400,
      );
    }
  }
}
