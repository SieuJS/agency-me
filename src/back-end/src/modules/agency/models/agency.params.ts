import { PartialType, PickType } from "@nestjs/swagger";
import { AgencyDto } from "./agency.dto";

export class AgencyParams extends PartialType( PickType( AgencyDto , ['dien_thoai' , 'email', 'ngay_tiep_nhan' ,'tien_no', 'ten' ])){
}