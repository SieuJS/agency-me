import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ExportSheetsService } from '../../services/export-sheets/export-sheets.service';
import { ExportSheetInput } from '../../models/export-sheet.input';
import { AuthGuard } from '@nestjs/passport';
import { AuthPayloadDto } from 'src/modules/auth/models/auth-payload.dto';
import { ExportSheetInputPipe } from '../../pipes/export-sheet-input.pipe';

@ApiTags('Export Sheets')
@Controller('export-sheets')
export class ExportSheetsController {
  constructor(private readonly exportSheetsService: ExportSheetsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new export sheet' })
  @ApiResponse({
    status: 201,
    description: 'The export sheet has been successfully created.',
  })
  @ApiResponse({
    status: 404,
    description: 'Agency, employee, or item not found.',
  })
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  async createExportSheet(
    @Body(ExportSheetInputPipe) input: ExportSheetInput,
    @Req() req: { user: AuthPayloadDto },
  ) {
    const user = req.user;

    input.nhan_vien_lap_phieu = user.nhan_vien_id as unknown as string;
    return await this.exportSheetsService.createExportSheet(input);
  }
}
