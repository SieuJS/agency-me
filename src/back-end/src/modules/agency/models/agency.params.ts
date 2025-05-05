import { ApiProperty, PartialType, PickType } from "@nestjs/swagger";
import { AgencyDto } from "./agency.dto";

export class AgencyParams extends PartialType( PickType( AgencyDto , ['dien_thoai' , 'email', 'ngay_tiep_nhan' ,'tien_no', 'ten' ])){
    @ApiProperty({
        example : "1",
        description : "Page 1"
    })
    page : number;

    @ApiProperty({
        example : "10",
        description : "10 items per page"
    })
    perPage : number;
}