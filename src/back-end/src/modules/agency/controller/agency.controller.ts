import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AgencyService } from '../service/agency.service';
import { AgencyParams } from '../models/agency.params';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AgencyCreatedResponse, AgencyDto } from '../models/agency.dto';
import { AgencyPipe } from '../pipe/agency.pipe';
import { AgencyInput } from '../models/agency.input';
import { AgencyListResponse } from '../models/agency-list.response';
import { AuthGuard } from '@nestjs/passport';
import { AuthPayloadDto } from 'src/modules/auth/models/auth-payload.dto';

@Controller('agency')
export class AgencyController {
  constructor(private readonly agencyService: AgencyService) {}

  @Get('list')
  @ApiResponse({
    type: AgencyListResponse,
  })
  getAgencyList(@Query(new AgencyPipe()) params: AgencyParams) {
    return this.agencyService.getListAngencies(params);
  }

  @Post('create')
  @ApiResponse({
    type: AgencyCreatedResponse,
    description: 'Create a new agency',
  })
  @ApiBody({
    type: AgencyInput,
    description: 'Agency input data',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  async createAgency(
    @Body() input: AgencyInput,
    @Request() req: { user: AuthPayloadDto },
  ) {
    try {
      const { userId } = req.user;
      input.nhan_vien_tiep_nhan = userId;
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

  @Get('detail/:id')
  @ApiResponse({
    type: AgencyDto,
  })
  getAgencyDetail(@Param('id') id: string) {
    return this.agencyService.getAgencyDetail(id);
  }

  @Put('update/:id')
  @ApiResponse({
    type: AgencyDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  updateAgency(
    @Param('id') id: string,
    @Body() input: AgencyInput,
    @Request() req: { user: AuthPayloadDto },
  ) {
    const { userId } = req.user;
    input.nhan_vien_tiep_nhan = userId;
    return this.agencyService.updateAgency(id, input);
  }

  @Delete('delete/:id')
  @ApiResponse({
    type: AgencyDto,
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  deleteAgency(
    @Param('id') id: string,
    @Request() req: { user: AuthPayloadDto },
  ) {
    const { userId } = req.user;
    try {
      return this.agencyService.deleteAgency(id, userId);
    } catch (error) {
      throw new HttpException(
        (error as Error).message || 'An error occurred',
        400,
      );
    }
  }
}
