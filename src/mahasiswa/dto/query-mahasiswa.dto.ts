import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class QueryMahasiswaDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({
    example: 'email',
    enum: ['nim', 'nama', 'email', 'jurusan'],
  })
  @IsOptional()
  @IsIn(['nim', 'nama', 'email', 'jurusan'])
  column?: 'nim' | 'nama' | 'email' | 'jurusan';

  @ApiPropertyOptional({ example: 'budi@gmail.com' })
  @IsOptional()
  @IsString()
  search?: string;
}
