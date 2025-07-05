import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { AgencyParams } from '../models/agency.params';
import { AgencyDto } from '../models/agency.dto';
import { AgencyInput } from '../models/agency.input';
import { PaginationService } from 'src/modules/common/services/pagination.service';
import { AgencyListResponse } from '../models/agency-list.response';
import parser from 'any-date-parser';

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
        da_xoa: false,
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
        loaiDaiLy: {
          ten_loai: {
            contains: params.loai_daily,
            mode: 'insensitive',
          },
        },
        quan: {
          ten_quan: {
            contains: params.quan,
            mode: 'insensitive',
          },
        },
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
      throw new Error('Đại lý với số điện thoại hoặc email này đã tồn tại');
    }

    const existingNhanVien = await this.prisma.nhanVien.findUnique({
      where: {
        nhan_vien_id: nhan_vien_tiep_nhan,
      },
    });

    if (!existingNhanVien) {
      throw new Error('Không tìm thấy nhân viên tiếp nhận');
    }

    const existingLoaiDaiLy = await this.prisma.loaiDaiLy.findUnique({
      where: {
        loai_daily_id,
      },
    });
    if (!existingLoaiDaiLy) {
      throw new Error('Không tìm thấy loại đại lý');
    }
    const existingQuan = await this.prisma.quan.findUnique({
      where: {
        quan_id,
      },
    });
    if (!existingQuan) {
      throw new Error('Không tìm thấy quận');
    }
    
    // Kiểm tra số lượng đại lý trong quận (không tính da_xoa: true) so với gioi_han_so_daily
    const agencyCountInQuan = await this.prisma.daiLy.count({
      where: {
        quan_id,
        da_xoa: false,
      },
    });
    if (agencyCountInQuan >= existingQuan.gioi_han_so_daily) {
      throw new BadRequestException(`Số lượng tối đa đại lý (${existingQuan.gioi_han_so_daily}) trong quận này đã đạt giới hạn.`);
    }
    
    // Tạo mã đại lý (daily_id) tự động
    const count = await this.prisma.daiLy.count();
    const daily_id = `daily${(count + 1).toString().padStart(3, '0')}`;

    // Lấy ngày tiếp nhận theo múi giờ Việt Nam (+07:00)
    const vietnamDate = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh' });
    const ngayTiepNhan = new Date(vietnamDate);

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
        ngay_tiep_nhan: ngayTiepNhan,
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
        da_xoa: false,
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
      const existingQuan = await this.prisma.quan.findUnique({
        where: {
          quan_id: input.quan_id,
        },
      });
      if (!existingQuan) {
        throw new Error('Không tìm thấy quận');
      }
      
      // Kiểm tra số lượng đại lý trong quận (không tính da_xoa: true) so với gioi_han_so_daily
      const agencyCountInQuan = await this.prisma.daiLy.count({
        where: {
          quan_id: input.quan_id,
          da_xoa: false,
        },
      });
      if (agencyCountInQuan >= existingQuan.gioi_han_so_daily) {
        throw new BadRequestException(`Số lượng tối đa đại lý (${existingQuan.gioi_han_so_daily}) trong quận này đã đạt giới hạn.`);
      }

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

    if( input.ngay_tiep_nhan !== undefined && input.ngay_tiep_nhan !== null) {
      updateData.ngay_tiep_nhan = parser.fromAny(input.ngay_tiep_nhan);
    }

    const existingAgency = await this.prisma.daiLy.findUnique({
      where: { daily_id: id, da_xoa: false },
    });
    if (!existingAgency) {
      throw new NotFoundException('Không tìm thấy đại lý');
    }

    const agency = await this.prisma.daiLy.update({
      where: { daily_id: id, da_xoa: false },
      include: {
        quan: true,
        loaiDaiLy: true,
        nhanVien: true,
      },
      data: updateData,
    });

    return new AgencyDto(agency);
  }

  async deleteAgency(id: string): Promise<AgencyDto> {
    const existingAgency = await this.prisma.daiLy.findUnique({
      where: { daily_id: id, da_xoa: false },
    });
    if (!existingAgency) {
      throw new NotFoundException('Không tìm thấy đại lý');
    }

    const agency = await this.prisma.daiLy.update({
      where: { daily_id: id, da_xoa: false },
      data: { da_xoa: true },
      include: {
        quan: true,
        loaiDaiLy: true,
        nhanVien: true,
      },
    });
    if (!agency) {
      throw new NotFoundException('Không tìm thấy đại lý');
    }
    return new AgencyDto(agency);
  }
}
