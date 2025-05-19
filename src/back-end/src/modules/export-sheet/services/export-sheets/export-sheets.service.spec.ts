import { Test, TestingModule } from '@nestjs/testing';
import { ExportSheetsService } from './export-sheets.service';

describe('ExportSheetsService', () => {
  let service: ExportSheetsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ExportSheetsService],
    }).compile();

    service = module.get<ExportSheetsService>(ExportSheetsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
