import { ApiProperty } from "@nestjs/swagger";

export class AgencyDto {
    @ApiProperty({
        example : "1",
    })
    daily_id: string;

    @ApiProperty({
        example : "Công ty TNHH ABC",
    })
    ten: string;

    @ApiProperty({
        example : "0987654321",
    })
    dien_thoai : string;

    @ApiProperty({
        example : "daily@gmail.com"
    })
    email : string;

    @ApiProperty({
        example : "17000"
    })
    tien_no : number;

    @ApiProperty({
        example : "Hà Nội"
    })
    dia_chi : string;

    @ApiProperty({
        example : "12/12/2023"
    })
    ngay_tiep_nhan : Date;
}