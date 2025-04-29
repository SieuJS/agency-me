import { Controller, Get, Query } from '@nestjs/common';
import { AgencyService } from '../service/agency.service';
import { AgencyParams } from '../models/agency.params';
import { ApiResponse } from '@nestjs/swagger';
import { AgencyDto } from '../models/agency.dto';

@Controller('agency')
export class AgencyController {
    constructor(
        private readonly agencyService: AgencyService, // Assuming you have an AgencyService to handle business logic
    ) {}

    @Get('list')
    @ApiResponse({
        type : AgencyDto,
        isArray : true,
    })
    getAgencyList(@Query() params : AgencyParams) {
        return this.agencyService.getListAngencies(params);
    }
}
