import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../common';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.nhanVien.findUnique({ where: { email } });
  }

  async createUser(registerDto: {
    email: string;
    password: string;
    ten: string;
    dien_thoai: string;
    loai_nhan_vien_id: string;
    dia_chi: string;
  }) {
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    return this.prisma.nhanVien.create({
      data: {
        nhan_vien_id: uuidv4(),
        ten: registerDto.ten,
        dien_thoai: registerDto.dien_thoai,
        email: registerDto.email,
        loai_nhan_vien_id: registerDto.loai_nhan_vien_id,
        dia_chi: registerDto.dia_chi,
        mat_khau: hashedPassword,
        ngay_them: new Date(),
      },
    });
  }

  async findById(id: string) {
    return this.prisma.nhanVien.findUnique({ where: { nhan_vien_id: id } });
  }
}
