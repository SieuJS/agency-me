import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common';
import { DistrictDto } from '../models/district.dto';

@Injectable()
export class DistrictService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<DistrictDto[]> {
    const districts = await this.prisma.quan.findMany();
    return districts.map(district => ({
      districtId: district.quan_id,
      name: district.ten_quan,
      city: district.thanh_pho,
      maxAgencies: district.gioi_han_so_daily,
    }));
  }
}