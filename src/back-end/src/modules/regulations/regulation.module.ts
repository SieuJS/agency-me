import { Module } from '@nestjs/common';
import { RegulationController } from './controller/regulation.controller';
import { RegulationService } from './service/regulation.service';
import { CommonModule } from '../common';

@Module({
  imports: [CommonModule],
  controllers: [RegulationController],
  providers: [RegulationService],
  exports: [RegulationService],
})
export class RegulationModule {}