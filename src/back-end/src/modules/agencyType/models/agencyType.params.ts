import { ApiProperty, PartialType, PickType } from "@nestjs/swagger";
import { AgencyTypeDto } from "./agencyType.dto";

export class AgencyTypeParams extends PartialType (PickType(AgencyTypeDto, ['ten_loai', 'tien_no_toi_da'])) {
    @ApiProperty({
        example: "1",
        description: "Page 1"
    })
    page: number;

    @ApiProperty({
        example: "10",
        description: "10 items per page"
    })
    perPage: number;
}