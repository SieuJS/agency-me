import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { NhanVien } from '@prisma/client';
import { AuthPayloadDto } from '../models/auth-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    email: string,
    password: string,
  ): Promise<NhanVien | null> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('User not found');
    const isMatch =
      user.mat_khau && (await bcrypt.compare(password, user.mat_khau));
    if (isMatch) {
      const { ...result } = user;
      return result;
    }
    return null;
  }

  login(user: AuthPayloadDto) {
    const payload = user;
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
