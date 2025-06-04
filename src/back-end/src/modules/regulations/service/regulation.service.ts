import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { UpdateRegulationInput } from '../models/update-regulation.input';

@Injectable()
export class RegulationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const quyDinh = await this.prisma.quy_Dinh_1.findMany();
    if (!quyDinh || quyDinh.length === 0) throw new NotFoundException('Không tìm thấy quy định');
    return quyDinh;
  }

  async update(input: UpdateRegulationInput) {
    // Chỉ cho phép update các trường hợp lệ
    const allowedKeys = [
      'so_luong_cac_loai_daily',
      'so_dai_ly_toi_da_trong_quan',
      'so_luong_mat_hang_toi_da',
      'so_luong_don_vi_tinh',
      'tien_no_toi_da',
    ];
    if (!allowedKeys.includes(input.key)) {
      throw new NotFoundException('Trường quy định không hợp lệ');
    }
    const data = { [input.key]: input.value };
    const quyDinh = await this.prisma.quy_Dinh_1.update({
      where: { loai_daily_id: input.loai_daily_id },
      data,
    });
    return quyDinh;
  }
}