// import { Injectable } from '@nestjs/common';
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './modules/common';
import { DaiLy } from '@prisma/client';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  constructor(private readonly prisma: PrismaService) {}

  async createDaiLy(data: {
    ten: string;
    dien_thoai: string;
    dia_chi: string;
    email: string;
    quan_id: string;
    loai_daily_id: string;
    tien_no: number;
    nhan_vien_tiep_nhan: string;
  }): Promise<DaiLy> {
    // Kiểm tra dữ liệu đầu vào
    if (
      !data.ten ||
      !data.dien_thoai ||
      !data.dia_chi ||
      !data.email ||
      !data.quan_id ||
      !data.loai_daily_id ||
      data.tien_no === undefined ||
      !data.nhan_vien_tiep_nhan
    ) {
      throw new BadRequestException('Vui lòng cung cấp đầy đủ thông tin');
    }

    // Tạo daily_id tự động
    const count = await this.prisma.daiLy.count();
    const daily_id = `daily${(count + 1).toString().padStart(3, '0')}`;

    // Tạo đại lý mới với daily_id và ngay_tiep_nhan tự động
    return this.prisma.daiLy.create({
      data: {
        daily_id,
        ten: data.ten,
        dien_thoai: data.dien_thoai,
        dia_chi: data.dia_chi,
        email: data.email,
        quan_id: data.quan_id,
        loai_daily_id: data.loai_daily_id,
        tien_no: data.tien_no,
        ngay_tiep_nhan: new Date(), // Tự động lấy thời gian hiện tại
        nhan_vien_tiep_nhan: data.nhan_vien_tiep_nhan,
      },
    });
  }
}
