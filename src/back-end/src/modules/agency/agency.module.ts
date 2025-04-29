import { Module } from '@nestjs/common';
import { AgencyService } from './service/agency.service';
import { AgencyController } from './controller/agency.controller';


@Module({
  providers: [AgencyService],
  controllers: [AgencyController]
})
export class AgencyModule {}
