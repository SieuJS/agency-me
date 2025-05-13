import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { AgencyParams } from '../models/agency.params';
import { AgencyDto } from '../models/agency.dto';
import { AgencyInput } from '../models/agency.input';
import { PaginationService } from 'src/modules/common/services/pagination.service';
import { AgencyListResponse } from '../models/agency-list.response';

@Injectable()
export class AgencyService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService<AgencyDto>,
  ) {}

  async getListAngencies(
    params: AgencyParams,
  ): Promise<AgencyListResponse | null> {
    const { tien_no, ten, ngay_tiep_nhan } = params;
    const rawResult = await this.prisma.daiLy.findMany({
      where: {
        tien_no: tien_no
          ? {
              gte: tien_no,
            }
          : {},
        ten: ten
          ? {
              contains: ten,
              mode: 'insensitive',
            }
          : {},
        ngay_tiep_nhan: ngay_tiep_nhan
          ? {
              gte: new Date(ngay_tiep_nhan),
            }
          : {},
      },
      include: {
        quan: true,
        loaiDaiLy: true,
        nhanVien: true,
      },
    });

    const reponse = this.paginationService.paginate(
      rawResult.map((item) => new AgencyDto(item)),
      params.page,
      params.perPage,
    );
    return reponse;
  }

  async createAgency(input: AgencyInput): Promise<AgencyDto> {
    const {
      ten,
      dien_thoai,
      email,
      dia_chi,
      loai_daily_id,
      quan_id,
      tien_no,
      nhan_vien_tiep_nhan,
    } = input;
    const existingAgency = await this.prisma.daiLy.findFirst({
      where: {
        OR: [
          { dien_thoai: { equals: dien_thoai } },
          { email: { equals: email } },
        ],
      },
    });
    if (existingAgency) {
      throw new Error('Agency with this phone number or email already exists');
    }

    const existingNhanVien = await this.prisma.nhanVien.findUnique({
      where: {
        nhan_vien_id: nhan_vien_tiep_nhan,
      },
    });

    if (!existingNhanVien) {
      throw new Error('Employee not found');
    }

    const existingLoaiDaiLy = await this.prisma.loaiDaiLy.findUnique({
      where: {
        loai_daily_id,
      },
    });
    if (!existingLoaiDaiLy) {
      throw new Error('Agency type not found');
    }
    const existingQuan = await this.prisma.quan.findUnique({
      where: {
        quan_id,
      },
    });
    if (!existingQuan) {
      throw new Error('District not found');
    }

    const count = await this.prisma.daiLy.count();
    const daily_id = `daily${(count + 1).toString().padStart(3, '0')}`;
    const agency = await this.prisma.daiLy.create({
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
        nhan_vien_tiep_nhan,
      },
      include: {
        quan: true,
        loaiDaiLy: true,
        nhanVien: true,
      },
    });
    return new AgencyDto(agency);
  }

  async getAgencyDetail(id: string): Promise<AgencyDto | null> {
    const agency = await this.prisma.daiLy.findUnique({
      where: {
        daily_id: id,
      },
      include: {
        quan: true,
        loaiDaiLy: true,
        nhanVien: true,
      },
    });

    if (!agency) {
      return null;
    }
    return new AgencyDto(agency);
  }

  async updateAgency(id: string, input: AgencyInput): Promise<AgencyDto> {
    // Create data object with only defined fields
    const updateData: Record<string, any> = {};

    // Only add fields that are not null or undefined
    if (input.quan_id !== undefined && input.quan_id !== null) {
      updateData.quan_id = input.quan_id;
    }

    if (
      input.nhan_vien_tiep_nhan !== undefined &&
      input.nhan_vien_tiep_nhan !== null
    ) {
      updateData.nhan_vien_tiep_nhan = input.nhan_vien_tiep_nhan;
    }

    if (input.ten !== undefined && input.ten !== null) {
      updateData.ten = input.ten;
    }

    if (input.dien_thoai !== undefined && input.dien_thoai !== null) {
      updateData.dien_thoai = input.dien_thoai;
    }

    if (input.email !== undefined && input.email !== null) {
      updateData.email = input.email;
    }

    if (input.dia_chi !== undefined && input.dia_chi !== null) {
      updateData.dia_chi = input.dia_chi;
    }

    if (input.loai_daily_id !== undefined && input.loai_daily_id !== null) {
      updateData.loai_daily_id = input.loai_daily_id;
    }

    if (input.tien_no !== undefined && input.tien_no !== null) {
      updateData.tien_no = input.tien_no;
    }

    const agency = await this.prisma.daiLy.update({
      where: { daily_id: id },
      include: {
        quan: true,
        loaiDaiLy: true,
        nhanVien: true,
      },
      data: updateData,
    });

    return new AgencyDto(agency);
  }

  async deleteAgency(id: string, userId: string): Promise<AgencyDto> {
    const existingAgency = await this.prisma.daiLy.findUnique({
      where: { daily_id: id },
    });
    if (!existingAgency) {
      throw new NotFoundException('Agency not found');
    }

    if (existingAgency.nhan_vien_tiep_nhan !== userId) {
      throw new ForbiddenException(
        'You are not authorized to delete this agency',
      );
    }

    const agency = await this.prisma.daiLy.delete({
      where: { daily_id: id, nhan_vien_tiep_nhan: userId },
      include: {
        quan: true,
        loaiDaiLy: true,
        nhanVien: true,
      },
    });
    if (!agency) {
      throw new NotFoundException('Agency not found');
    }
    return new AgencyDto(agency);
  }
}
