import { ApiProperty } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthPayloadDto } from './auth-payload.dto';

export class ProtectedResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: AuthPayloadDto })
  user: AuthPayloadDto;
}

export class RegisterResponse {
  @ApiProperty({
    example: 'Registered successfully',
    description: 'Message indicating the result of the operation',
  })
  message: string;

  @ApiProperty({
    type: RegisterDto,
    description: 'The registered account.',
  })
  account: RegisterDto;
}

export class LoginResponse {
  @ApiProperty({
    example: 'Login successfully',
    description: 'Message indicating the result of the operation',
  })
  message: string;

  @ApiProperty({
    type: LoginDto,
    description: 'account info',
  })
  account: LoginDto;
}
