import { ApiProperty } from "@nestjs/swagger";
import { LoaiDaiLy, Prisma } from "@prisma/client";

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

    constructor(dbInstance: LoaiDaiLy) {
        this.loai_daily_id = dbInstance.loai_daily_id;
        this.ten_loai = dbInstance.ten_loai;
        this.tien_no_toi_da = dbInstance.tien_no_toi_da;
      }
}