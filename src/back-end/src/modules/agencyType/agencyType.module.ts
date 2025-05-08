import { Module } from '@nestjs/common';
import { AgencyTypeService } from './service/agencyType.service';
import { AgencyTypeController } from './controller/agencyType.controller';
import { CommonModule } from '../common';

@Module({
  imports: [CommonModule],
  providers: [AgencyTypeService],
  controllers: [AgencyTypeController],
})
export class AgencyTypeModule {}