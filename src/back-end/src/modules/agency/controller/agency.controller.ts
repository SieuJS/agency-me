import { Body, Controller, Get, HttpException, Post, Query, UsePipes } from '@nestjs/common';
import { AgencyService } from '../service/agency.service';
import { AgencyParams } from '../models/agency.params';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { AgencyDto } from '../models/agency.dto';
import { AgencyPipe } from '../pipe/agency.pipe';
import { AgencyInput } from '../models/agency.input';

@Controller('agency')
export class AgencyController {
    constructor(
        private readonly agencyService: AgencyService, 
    ) {}

    @Get('list')
    @ApiResponse({
        type : AgencyDto,
        isArray : true,
    })
    getAgencyList(@Query(new AgencyPipe()) params : AgencyParams) {
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
        try{
            const newAgency = await this.agencyService.createAgency(input);
            return {
                message: 'Agency created successfully',
                agency: newAgency,
            };
        }catch (error) {
            throw new HttpException(error.message, 400);
        }
    }
}
