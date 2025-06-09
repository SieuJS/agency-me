import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/modules/common';
import { UpdateGeneralRegulationInput, UpdateMaxDebtInput } from '../models/update-regulation.input';

@Injectable()
export class RegulationService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const quyDinh = await this.prisma.quy_Dinh_1.findMany();
    if (!quyDinh || quyDinh.length === 0) throw new NotFoundException('Không tìm thấy quy định');
    return quyDinh;
  }

  async update_general(input: UpdateGeneralRegulationInput) {
    // Chỉ cho phép update các trường hợp lệ
    const allowedKeys = [
      'so_luong_cac_loai_daily',
      'so_dai_ly_toi_da_trong_quan',
      'so_luong_mat_hang_toi_da',
      'so_luong_don_vi_tinh',
    ];
    if (!allowedKeys.includes(input.key)) {
      throw new NotFoundException('Trường quy định không hợp lệ');
    }

    if (input.key == 'so_luong_cac_loai_daily') {
      // Tính số lượng các loại đại lý hiện tại
      const count = await this.prisma.loaiDaiLy.count();
      if (count > input.value) {
        throw new BadRequestException('Số lượng loại đại lý hiện tại lớn hơn giá trị điều chỉnh');
      }
    }
    else if (input.key == 'so_dai_ly_toi_da_trong_quan') {
      // Đếm số đại lý theo từng quận
      const so_dai_ly_theo_quan = await this.prisma.daiLy.groupBy({
        by: ['quan_id'],
        _count: { daily_id: true },
        where: { quan_id: { not: undefined } },
      });

      // Tìm quận có số đại lý lớn nhất
      const sl_max = Math.max(...so_dai_ly_theo_quan.map(q => q._count.daily_id));

      if (sl_max > input.value) {
        throw new BadRequestException('Có quận có số đại lý hiện tại lớn hơn giá trị điều chỉnh');
      }
    }
    else if (input.key == 'so_luong_mat_hang_toi_da') {
      // Tính số lượng mặt hàng hiện tại
      const count = await this.prisma.matHang.count();
      if (count > input.value) {
        throw new BadRequestException('Số lượng mặt hàng hiện tại lớn hơn giá trị điều chỉnh');
      }
    }
    else {
      // Kiểm tra số lượng đơn vị tính
      const count = await this.prisma.donViTinh.count();
      if (count > input.value) {
        throw new BadRequestException('Số lượng đơn vị tính hiện tại lớn hơn giá trị điều chỉnh');
      }
    }

    const data = { [input.key]: input.value };
    const quyDinh = await this.prisma.quy_Dinh_1.update({
      where: { id: 1 }, // quy định default
      data,
    });
    return quyDinh;
  }

  async update_max_debt(input: UpdateMaxDebtInput) {
    // Tìm nợ lớn nhất hiện tại của các đại lý thuộc loại này
    const list_daily = await this.prisma.daiLy.aggregate({
      where: { loai_daily_id: input.loai_daily_id },
      _max: { tien_no: true },
    });
    const no_toi_da = list_daily._max.tien_no ?? 0;

    if (no_toi_da > input.value) {
      throw new BadRequestException('Tiền nợ điều chỉnh bé hơn nợ tối đa hiện có của các đại lý');
    }

    const data = { 'tien_no_toi_da': input.value };
    const loaiDaiLy = await this.prisma.loaiDaiLy.update({
      where: { loai_daily_id: input.loai_daily_id },
      data
    });

    return loaiDaiLy
  }
}