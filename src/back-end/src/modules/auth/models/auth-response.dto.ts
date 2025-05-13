import { ApiProperty } from '@nestjs/swagger';
import { NhanVien } from '@prisma/client';

export class ProtectedResponseDto {
  @ApiProperty()
  message: string;

  @ApiProperty({ type: 'object', additionalProperties: true })
  user: NhanVien;
}
