import { Module } from '@nestjs/common';
import { ReportRevenueController } from './controllers/report-revenue.controller';
import { ReportRevenueService } from './services/report-revenue.service';
import { CommonModule } from '../common';

@Module({
  imports: [CommonModule],
  controllers: [ReportRevenueController],
  providers: [ReportRevenueService],
})
export class ReportRevenueModule {}
