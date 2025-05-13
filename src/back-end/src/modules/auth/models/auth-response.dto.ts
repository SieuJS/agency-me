import { ApiProperty } from '@nestjs/swagger';
import { AuthPayloadDto } from './auth-payload.dto';

export class ProtectedResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: AuthPayloadDto })
  user: AuthPayloadDto;
}
