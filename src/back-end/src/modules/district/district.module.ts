import { Module } from '@nestjs/common';
import { DistrictController } from './controller/district.controller';
import { DistrictService } from './service/district.service';
import { CommonModule } from '../common';

@Module({
  imports: [CommonModule],
  controllers: [DistrictController],
  providers: [DistrictService],
  exports: [DistrictService],
})
export class DistrictModule {}