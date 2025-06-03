import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportRevenueService } from '../services/report-revenue.service';
import { ReportRevenueResponse } from '../models/report-revenue.dto';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('Revenue Reports')
@Controller('revenue-reports')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
export class ReportRevenueController {
  constructor(private readonly reportRevenueService: ReportRevenueService) {}

  @Get()
  @ApiOperation({ summary: 'Generate revenue report by agency' })
  @ApiResponse({
    status: 200,
    description: 'The revenue report has been successfully generated.',
    type: ReportRevenueResponse,
  })
  async generateRevenueReport(): Promise<ReportRevenueResponse> {
    return await this.reportRevenueService.generateRevenueReport();
  }
} 