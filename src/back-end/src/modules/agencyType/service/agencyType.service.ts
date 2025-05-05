import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { AgencyTypeParams } from '../models/agencyType.params';
import { AgencyTypeDto } from '../models/agencyType.dto';
import { PaginationService } from 'src/modules/common/services/pagination.service';
import { AgencyTypeListResponse } from '../models/agency-type-list.response';
import { AgencyTypeInput } from '../models/agency-type.input';

@Injectable()
export class AgencyTypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationService : PaginationService<AgencyTypeDto>,
    ) {}

  // async getListAgencyTypes(params: AgencyTypeParams): Promise<AgencyTypeDto[] | null> {
  async getListAgencyTypes(params: AgencyTypeParams): Promise<AgencyTypeListResponse | null> {
    const { ten_loai, tien_no_toi_da } = params;
    const rawResult = await this.prisma.loaiDaiLy.findMany({
      where: {
        ten_loai: ten_loai ? {
          contains: ten_loai,
          mode: 'insensitive',
        } : {},
        tien_no_toi_da: tien_no_toi_da ? {
          lte: tien_no_toi_da,
        } : {},
      },
    });

    // return rawResult.map((item): AgencyTypeDto => ({
    //   loai_daily_id: item.loai_daily_id,
    //   ten_loai: item.ten_loai,
    //   tien_no_toi_da: item.tien_no_toi_da,
    // }));
    const reponse = await this.paginationService.paginate(
      rawResult,
      params.page,
      params.perPage
    )
    return reponse as AgencyTypeListResponse; // Ép kiểu nếu cần
  }


  async createAgencyType(input: AgencyTypeInput): Promise<AgencyTypeDto> {
    const { ten_loai, tien_no_toi_da } = input;

    // Kiểm tra trùng tên loại đại lý
    const existingAgencyType = await this.prisma.loaiDaiLy.findFirst({
      where: {
        ten_loai: { equals: ten_loai, mode: 'insensitive' },
      },
    });
    if (existingAgencyType) {
      throw new Error('Agency type with this name already exists');
    }

    // Sinh loai_daily_id tự động
    const count = await this.prisma.loaiDaiLy.count();
    const loai_daily_id = `loai${(count + 1).toString().padStart(3, '0')}`;

    // Tạo bản ghi mới
    const newAgencyType = await this.prisma.loaiDaiLy.create({
      data: {
        loai_daily_id,
        ten_loai,
        tien_no_toi_da,
      },
    });
    // Trả về DTO
    return new AgencyTypeDto(newAgencyType);
  }
}