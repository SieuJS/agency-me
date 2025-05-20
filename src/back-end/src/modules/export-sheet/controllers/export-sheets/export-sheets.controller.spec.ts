import { Test, TestingModule } from '@nestjs/testing';
import { ExportSheetsController } from './export-sheets.controller';

describe('ExportSheetsController', () => {
  let controller: ExportSheetsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExportSheetsController],
    }).compile();

    controller = module.get<ExportSheetsController>(ExportSheetsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
