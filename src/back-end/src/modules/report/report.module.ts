import { Module } from '@nestjs/common';
import { ReportController } from './controller/report.controller';
import { ReportService } from './service/report.service';
import { CommonModule } from '../common';

@Module({
  imports: [CommonModule],
  controllers: [ReportController],
  providers: [ReportService],
  exports: [ReportService],
})
export class ReportModule {}