import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { AgencyParams } from '../models/agency.params';
import { AgencyDto } from '../models/agency.dto';
import { AgencyInput } from '../models/agency.input';
import { PaginationService } from 'src/modules/common/services/pagination.service';
import { AgencyListResponse } from '../models/agency-list.response';

@Injectable()
export class AgencyService {
    constructor (
        private readonly prisma: PrismaService,
        private readonly paginationService : PaginationService<AgencyDto>,
    ){}

    async getListAngencies(params : AgencyParams) : Promise<AgencyListResponse| null> {
        const {dien_thoai, email,tien_no, ten , ngay_tiep_nhan} = params;
        const rawResult = await  this.prisma.daiLy.findMany({
            where: {
                dien_thoai : (dien_thoai ? {
                    contains: dien_thoai,
                    mode: 'insensitive'
                } : {}),
                email : (email ? {
                    contains: email,
                    mode: 'insensitive'
                } : {}),
                tien_no : (tien_no ? {
                    gte: tien_no
                } : {}),
                ten : (ten ? {
                    contains: ten,
                    mode: 'insensitive'
                } : {}),
                ngay_tiep_nhan : (ngay_tiep_nhan ? {
                    gte: new Date(ngay_tiep_nhan)
                } : {})
            },
            include: {
                nhanVien: true,
                quan: true,
                loaiDaiLy: true,
                phieuXuatHangs: true,
                phieuThuTiens: true,
            },
        });

        const reponse = await this.paginationService.paginate(
            rawResult.map((item) => new AgencyDto(item)),
            params.page,
            params.perPage
        )
        return reponse
    }

    async createAgency(input : AgencyInput) : Promise<AgencyDto> {
        const {ten, dien_thoai, email, dia_chi, loai_daily_id, quan_id, tien_no, nhan_vien_tiep_nhan} = input;
        const existingAgency = await this.prisma.daiLy.findFirst({
            where: {
                OR: [
                    { dien_thoai: { equals: dien_thoai } },
                    { email: { equals: email } }
                ]
            }
        });
        if (existingAgency) {
            throw new Error('Agency with this phone number or email already exists');
        }

        const existingNhanVien = await this.prisma.nhanVien.findUnique({
            where: {
                nhan_vien_id: nhan_vien_tiep_nhan
            }
        });

        if (!existingNhanVien) {
            throw new Error('Employee not found');
        }

        const existingLoaiDaiLy = await this.prisma.loaiDaiLy.findUnique({
            where: {
                loai_daily_id
            }
        });
        if (!existingLoaiDaiLy) {
            throw new Error('Agency type not found');
        }
        const existingQuan = await this.prisma.quan.findUnique({
            where: {
                quan_id
            }
        });
        if (!existingQuan) {
            throw new Error('District not found');  
        }

        const count = await this.prisma.daiLy.count();
        const daily_id = `daily${(count + 1).toString().padStart(3, '0')}`;
        const createdDaily =  await this.prisma.daiLy.create({
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
            },
            include: {
                nhanVien: true,
                quan: true,
                loaiDaiLy: true,
                phieuXuatHangs: true,
                phieuThuTiens: true,
            }
        });
        return new AgencyDto(createdDaily);
    }
}
