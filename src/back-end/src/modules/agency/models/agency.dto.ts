import { ApiProperty } from "@nestjs/swagger";
import { DaiLy, Prisma } from "@prisma/client";
import { IsEmail } from "class-validator";

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
    @IsEmail()
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

    constructor (dbIstance : DaiLy){
        this.daily_id = dbIstance.daily_id;
        this.ten = dbIstance.ten;
        this.dien_thoai = dbIstance.dien_thoai;
        this.email = dbIstance.email;
        this.tien_no = dbIstance.tien_no;
        this.dia_chi = dbIstance.dia_chi;
        this.ngay_tiep_nhan = dbIstance.ngay_tiep_nhan;
    }
}