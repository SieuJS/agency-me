import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ReportService } from '../service/report.service';
import { AuthGuard } from '@nestjs/passport';
import { ReportDebtInput } from '../models/report.input';
import { ReportDebtDto } from '../models/report.dto';

@Controller('report')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token') 
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('debt')
  @ApiOperation({ summary: "Báo cáo công nợ"})
  async calcDebt(@Query() params: ReportDebtInput): Promise<ReportDebtDto[]> {
    return this.reportService.calcDebt(params);
  }
}