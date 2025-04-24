import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';

@Controller('auth')
export class AuthController {
  // Route bảo vệ bình thường (ai đăng nhập cũng vào được)
  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtectedData() {
    return {
      message: 'Authenticated!!',
    };
  }

  // Route chỉ cho admin tạo tài khoản mới
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Post('register')
  registerUser() {
    return {
      message: 'User created!',
    };
  }
}
