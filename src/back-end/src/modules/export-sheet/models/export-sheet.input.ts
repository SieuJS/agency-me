import { ApiProperty, OmitType, PickType } from "@nestjs/swagger";
import { ExportSheetsDto } from "./export-sheets.dto";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";
import { IsString } from "class-validator";
import { ItemDto } from "src/modules/item/models/item.dto";

export class ExportSheetInput extends OmitType(ExportSheetsDto, ['phieu_id','daily_name','nhan_vien_lap_phieu']) {
    @ApiProperty({
        description: 'Id dai ly',
        example: '1234567890',
    })
    @IsString()
    @IsNotEmpty()
    daily_id: string;

    @ApiProperty({
        description: 'Id nhan vien',
        example: '1234567890',
        required: false,
    })
    nhan_vien_lap_phieu: string;

    @ApiProperty({
        description: 'Danh sach mat hang',
        example: [
            {
                mathang_id: '1234567890',
                so_luong: 10,
            },
        ],
    })
    @IsArray()
    @IsNotEmpty()
    items: ItemInExportSheet[];
}

export class ItemInExportSheet extends PickType(ItemDto, ['mathang_id','mathang_id']) {
    @ApiProperty({
        description: 'So luong',
        example: 10,
    })
    @IsNumber()
    @IsNotEmpty()
    so_luong: number;
}
