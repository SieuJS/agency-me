import { ApiProperty } from '@nestjs/swagger';

export class DeleteAgencyTypeResponse {
  @ApiProperty({
    example: 'Agency type deleted successfully',
    description: 'Message indicating the result of the delete operation',
  })
  message: string;
}