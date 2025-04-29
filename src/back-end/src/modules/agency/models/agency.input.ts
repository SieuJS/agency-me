import { OmitType } from "@nestjs/swagger";
import { AgencyDto } from "./agency.dto";

export class AgencyInput extends OmitType(AgencyDto, ['daily_id']) {
    loai_daily_id: string;
    quan_id: string;
    nhan_vien_tiep_nhan: string;
}