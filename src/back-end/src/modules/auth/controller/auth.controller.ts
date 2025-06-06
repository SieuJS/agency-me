import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../service/auth.service';
import { UsersService } from '../../users/users.service';
import { LoginDto, RegisterDto } from '../models/auth.dto';
import { ApiBearerAuth, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ProtectedResponseDto } from '../models/auth-response.dto';
import { AuthPayloadDto } from '../models/auth-payload.dto';
import { RegisterResponse } from '../models/auth-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  @ApiResponse({
    status: 200,
    description: 'Authenticated!!',
    type: ProtectedResponseDto,
  })
  @ApiBearerAuth('access-token')
  getProtectedData(
    @Request() req: { user: AuthPayloadDto },
  ): ProtectedResponseDto {
    return {
      message: 'Authenticated!!',
      user: req.user,
    };
  }

  @Post('register')
  @ApiResponse({
    type: RegisterResponse,
    description: 'Register a new account',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Account with this name already exists',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Account with this name already exists',
        },
      },
    },
  })
  @ApiBody({ type: RegisterDto })
  async register(@Body() registerDto: RegisterDto) {
    const existing = await this.usersService.findByEmail(registerDto.email);
    if (existing) throw new BadRequestException('Email already in use');
    // Ensure all required fields are passed to createUser
    const { email, password, ten, dienThoai, loaiNhanVienId, diaChi } =
      registerDto;
    const user = await this.usersService.createUser({
      email,
      password,
      ten,
      dien_thoai: dienThoai,
      loai_nhan_vien_id: loaiNhanVienId,
      dia_chi: diaChi,
    });
    return { message: 'User registered', userId: user.nhan_vien_id };
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  @ApiResponse({
    description: 'Login to an account',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Wrong email or password',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Wrong email or password',
        },
      },
    },
  })
  @ApiBody({ type: LoginDto })
  login(@Request() req: { user: AuthPayloadDto }) {
    return this.authService.login(req.user);
  }
}
