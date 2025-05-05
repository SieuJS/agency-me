import { ApiProperty, OmitType } from "@nestjs/swagger";
import { AgencyTypeDto } from "./agencyType.dto";

export class AgencyTypeInput extends OmitType(AgencyTypeDto, ['loai_daily_id']) {}