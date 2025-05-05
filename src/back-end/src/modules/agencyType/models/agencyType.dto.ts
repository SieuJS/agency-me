import { ApiProperty } from "@nestjs/swagger";

export class AgencyTypeDto {
    @ApiProperty({
        example: "1",
    })
    loai_daily_id: string;

    @ApiProperty({
        example: "Loại 1",
    })
    ten_loai: string;

    @ApiProperty({
        example: 20000,
    })
    tien_no_toi_da: number;
}