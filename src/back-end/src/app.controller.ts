import { Controller, Get, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('daily')
  @HttpCode(HttpStatus.CREATED)
  async createDaiLy(
    @Body() body: {
      ten: string;
      dien_thoai: string;
      dia_chi: string;
      email: string;
      quan_id: string;
      loai_daily_id: string;
      tien_no: number;
      nhan_vien_tiep_nhan: string;
    },
  ) {
    const newDaiLy = await this.appService.createDaiLy({
      ten: body.ten,
      dien_thoai: body.dien_thoai,
      dia_chi: body.dia_chi,
      email: body.email,
      quan_id: body.quan_id,
      loai_daily_id: body.loai_daily_id,
      tien_no: body.tien_no,
      nhan_vien_tiep_nhan: body.nhan_vien_tiep_nhan,
    });
    return { message: 'Thêm đại lý thành công', data: newDaiLy };
  }
}


