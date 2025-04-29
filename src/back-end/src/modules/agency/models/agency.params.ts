import { PickType } from "@nestjs/swagger";
import { AgencyDto } from "./agency.dto";

export class AgencyParams extends PickType( AgencyDto , ['dien_thoai' , 'email', 'ngay_tiep_nhan' ,'tien_no', 'ten' ]){
    
}