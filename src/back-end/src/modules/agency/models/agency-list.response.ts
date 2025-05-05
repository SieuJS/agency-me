import { PaginationDTO } from "src/modules/common";
import { AgencyDto } from "./agency.dto";
import { ApiProperty } from "@nestjs/swagger";

export class AgencyListResponse {
    @ApiProperty({
        type: AgencyDto,
        isArray: true,
        description: "List of agencies"
    })
    payload : AgencyDto[];
    meta : PaginationDTO;
}