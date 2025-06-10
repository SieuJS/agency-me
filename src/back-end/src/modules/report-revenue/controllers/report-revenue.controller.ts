import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ReportRevenueService } from '../services/report-revenue.service';
import { ReportRevenueResponse, ReportRevenueTimeRangeDto } from '../models/report-revenue.dto';
import { AuthGuard } from '@nestjs/passport';
import { RevenueTimePipe } from '../pipes/revenue-time.pipe';

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
  async generateRevenueReport(@Query(new RevenueTimePipe())thoi_gian : ReportRevenueTimeRangeDto): Promise<ReportRevenueResponse> {
    return await this.reportRevenueService.generateRevenueReport(thoi_gian);
  }
} 