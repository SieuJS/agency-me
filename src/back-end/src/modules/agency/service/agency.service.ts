import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { AgencyParams } from '../models/agency.params';
import { AgencyDto } from '../models/agency.dto';

@Injectable()
export class AgencyService {
    constructor (
        private readonly prisma: PrismaService
    ){}

    async getListAngencies(params : AgencyParams) : Promise<AgencyDto[] | null> {
        const {dien_thoai, email, ngay_tiep_nhan, tien_no, ten} = params;
        const rawResult = await  this.prisma.daiLy.findMany({
            where: {
                dien_thoai,
                email,
                ngay_tiep_nhan,
                tien_no,
                ten
            }
        });
        return rawResult.map((item) : AgencyDto => {
            return {
                daily_id: item.daily_id,
                ten: item.ten,
                dien_thoai: item.dien_thoai,
                email: item.email,
                dia_chi: item.dia_chi,
                tien_no: item.tien_no,
                ngay_tiep_nhan: item.ngay_tiep_nhan
            }
        })
    }
}
