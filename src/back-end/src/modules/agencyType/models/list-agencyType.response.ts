import { PaginationDTO } from "src/modules/common";
import { AgencyTypeDto } from "./agencyType.dto";
import { ApiProperty } from "@nestjs/swagger";

export class AgencyTypeListResponse {
  @ApiProperty({
    type: AgencyTypeDto,
    isArray: true,
    description: "List of agency types",
  })
  payload: AgencyTypeDto[];

  @ApiProperty({
    type: PaginationDTO,
    description: "Pagination metadata",
  })
  meta: PaginationDTO;
}