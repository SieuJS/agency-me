import { Module } from '@nestjs/common';
import { ExportSheetsController } from './controllers/export-sheets/export-sheets.controller';
import { ExportSheetsService } from './services/export-sheets/export-sheets.service';

@Module({
  controllers: [ExportSheetsController],
  providers: [ExportSheetsService],
})
export class ExportSheetModule {}
