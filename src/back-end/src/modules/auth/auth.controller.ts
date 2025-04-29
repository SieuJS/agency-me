import { Controller, Get, Post, UseGuards, Body, BadRequestException, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtectedData(@Request() req) {
    return {
      message: 'Authenticated!!',
      user: req.user,
    };
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) throw new BadRequestException('Email already in use');
    const user = await this.usersService.createUser(registerDto);
    return { message: 'User registered', userId: user.nhan_vien_id };
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    // req.user được local.strategy trả về
    return this.authService.login(req.user);
  }
}
