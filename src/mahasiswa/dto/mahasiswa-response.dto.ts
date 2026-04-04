import { ApiProperty } from '@nestjs/swagger';

export class MahasiswaResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  nim: string;

  @ApiProperty()
  nama: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  jurusan: string;

  @ApiProperty()
  tanggal_lahir: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}
