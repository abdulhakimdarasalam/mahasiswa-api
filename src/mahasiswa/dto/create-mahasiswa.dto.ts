import { IsNotEmpty, IsString, IsEmail, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum Jurusan {
  INFORMATIKA = 'Informatika',
  SISTEM_INFORMASI = 'Sistem Informasi',
  TEKNIK_KOMPUTER = 'Teknik Komputer',
  TEKNIK_ELEKTRO = 'Teknik Elektro',
}

export class CreateMahasiswaDto {
  @ApiProperty({ example: '2215101017' })
  @IsNotEmpty()
  @IsString()
  nim: string;

  @ApiProperty({ example: 'Abuy' })
  @IsNotEmpty()
  @IsString()
  nama: string;

  @ApiProperty({ example: 'abuy@example.com' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: Jurusan.INFORMATIKA, enum: Jurusan })
  @IsNotEmpty()
  jurusan: Jurusan;

  @ApiProperty({ example: '2000-01-01' })
  @IsNotEmpty()
  @IsString()
  tanggal_lahir: string;

  @ApiProperty({ example: '2026-04-03T10:00:00.000Z' })
  @IsNotEmpty()
  @IsString()
  created_at: string;

  @ApiProperty({ example: '2026-04-03T10:00:00.000Z' })
  @IsNotEmpty()
  @IsString()
  updated_at: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ example: true })
  is_active: boolean;
}
