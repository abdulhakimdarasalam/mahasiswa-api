import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'abuy@example.com' })
  email: string;

  @ApiProperty({ example: 'Abuy' })
  name: string;

  @ApiProperty({ example: true })
  is_active: boolean;

  @ApiProperty({ example: '2026-04-03T10:00:00.000Z' })
  register_date: Date;
}
