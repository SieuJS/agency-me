import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { AgencyParams } from '../models/agency.params';
import { AgencyDto } from '../models/agency.dto';
import { AgencyInput } from '../models/agency.input';

@Injectable()
export class AgencyService {
    constructor (
        private readonly prisma: PrismaService
    ){}

    async getListAngencies(params : AgencyParams) : Promise<AgencyDto[] | null> {
        const {dien_thoai, email,tien_no, ten , ngay_tiep_nhan} = params;
        const rawResult = await  this.prisma.daiLy.findMany({
            where: {
                dien_thoai,
                email,
                tien_no,
                ten,
                ngay_tiep_nhan
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

    async createAgency(input : AgencyInput) : Promise<AgencyDto> {
        const {ten, dien_thoai, email, dia_chi, loai_daily_id, quan_id, tien_no, nhan_vien_tiep_nhan} = input;
        const count = await this.prisma.daiLy.count();
        const daily_id = `daily${(count + 1).toString().padStart(3, '0')}`;
        const rawResult = await this.prisma.daiLy.create({
            data: {
                daily_id,
                ten,
                dien_thoai,
                email,
                dia_chi,
                loai_daily_id,
                quan_id,
                tien_no,
                ngay_tiep_nhan: new Date(),
                nhan_vien_tiep_nhan
            }
        });
        return {
            daily_id: rawResult.daily_id,
            ten: rawResult.ten,
            dien_thoai: rawResult.dien_thoai,
            email: rawResult.email,
            dia_chi: rawResult.dia_chi,
            tien_no: rawResult.tien_no,
            ngay_tiep_nhan: rawResult.ngay_tiep_nhan
        }
    }
}
