import { Module } from '@nestjs/common';
import { AgencyService } from './service/agency.service';
import { AgencyController } from './controller/agency.controller';
import { CommonModule } from '../common';


@Module({
  imports : [CommonModule],
  providers: [AgencyService],
  controllers: [AgencyController]
})
export class AgencyModule {}
