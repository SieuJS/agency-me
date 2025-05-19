import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ExportSheetsService } from '../../services/export-sheets/export-sheets.service';
import { ExportSheetInput } from '../../models/export-sheet.input';
import { AuthGuard } from '@nestjs/passport';
import { AuthPayloadDto } from 'src/modules/auth/models/auth-payload.dto';

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
    async createExportSheet(@Body() input: ExportSheetInput, @Req() req: { user: AuthPayloadDto }) {
        const user = req.user as AuthPayloadDto;
        input.nhan_vien_lap_phieu = user.userId;
        return await this.exportSheetsService.createExportSheet(input);
    }
}
