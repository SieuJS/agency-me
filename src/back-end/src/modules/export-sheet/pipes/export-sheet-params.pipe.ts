import { PipeTransform, Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ExportSheetParams } from '../models/export-sheet.params';

@Injectable()
export class ExportSheetParamsPipe
  implements PipeTransform<any, ExportSheetParams>
{
  transform(value: any): ExportSheetParams {
    return plainToInstance(ExportSheetParams, value);
  }
}
