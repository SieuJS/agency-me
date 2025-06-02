import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { AgencyModule } from './modules/agency/agency.module';
import { UsersModule } from './modules/users/users.module';
import { CommonModule } from './modules/common';
import { AgencyTypeModule } from './modules/agencyType/agencyType.module';
import { DistrictModule } from './modules/district/district.module';
import { ItemModule } from './modules/item/item.module';
import { ExportSheetModule } from './modules/export-sheet/export-sheet.module';
import { RegulationModule } from './modules/regulations/regulation.module';
import { ReceiptModule } from './modules/receipt/receipt.module';
import { ReportModule } from './modules/report/report.module';

@Module({
  imports: [
    CommonModule,
    AuthModule,
    UsersModule,
    AgencyModule,
    AgencyTypeModule,
    DistrictModule,
    ItemModule,
    ExportSheetModule,
    RegulationModule,
    ReceiptModule,
    ReportModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}