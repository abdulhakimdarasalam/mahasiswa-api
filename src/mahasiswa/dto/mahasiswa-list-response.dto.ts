import { ApiProperty } from '@nestjs/swagger';
import { MahasiswaResponseDto } from './mahasiswa-response.dto';

export class MahasiswaListMetaDto {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  limit: number;

  @ApiProperty({ example: 125 })
  total: number;

  @ApiProperty({ example: 13 })
  totalPages: number;
}

export class MahasiswaListResponseDto {
  @ApiProperty({ type: [MahasiswaResponseDto] })
  data: MahasiswaResponseDto[];

  @ApiProperty({ type: MahasiswaListMetaDto })
  meta: MahasiswaListMetaDto;
}
