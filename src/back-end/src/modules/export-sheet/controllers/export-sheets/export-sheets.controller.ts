import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
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
import { ExportSheetsDto } from '../../models/export-sheets.dto';
import { ExportSheetListResponse } from '../../models/export-sheet-list.response';
import { ExportSheetParams } from '../../models/export-sheet.params';
import { ExportSheetParamsPipe } from '../../pipes/export-sheet-params.pipe';

@ApiTags('Export Sheets')
@Controller('export-sheets')
@UseGuards(AuthGuard('jwt'))
@ApiBearerAuth('access-token')
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
  async createExportSheet(
    @Body(ExportSheetInputPipe) input: ExportSheetInput,
    @Req() req: { user: AuthPayloadDto },
  ) {
    const user = req.user;

    input.nhan_vien_lap_phieu = user.nhan_vien_id as unknown as string;
    return await this.exportSheetsService.createExportSheet(input);
  }

  @Get('list')
  @ApiOperation({ summary: 'Get list of export sheets' })
  @ApiResponse({
    status: 200,
    description: 'The list of export sheets has been successfully retrieved.',
    type: ExportSheetListResponse,
  })
  async getListExportSheets(
    @Query(new ExportSheetParamsPipe()) params: ExportSheetParams,
  ) {
    console.log('ExportSheetParams:', params);
    return await this.exportSheetsService.getListExportSheets(params);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an export sheet by id' })
  @ApiResponse({
    status: 200,
    description: 'The export sheet has been successfully retrieved.',
    type: ExportSheetsDto,
  })
  async getExportSheetById(@Param('id') id: string) {
    return await this.exportSheetsService.getExportSheetById(id);
  }
}
