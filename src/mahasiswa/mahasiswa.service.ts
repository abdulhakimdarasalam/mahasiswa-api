import { Injectable } from '@nestjs/common';
import { KnexService } from '../database/knex.service';
import { CreateMahasiswaDto } from './dto/create-mahasiswa.dto';
import { MahasiswaResponseDto } from './dto/mahasiswa-response.dto';

@Injectable()
export class MahasiswaService {
  constructor(private readonly knex: KnexService) {}
  private mapToMahasiswaResponseDto(mahasiswa: any): MahasiswaResponseDto {
    return {
      id: mahasiswa.id,
      nim: mahasiswa.nim,
      nama: mahasiswa.nama,
      email: mahasiswa.email,
      jurusan: mahasiswa.jurusan,
      tanggal_lahir: mahasiswa.tanggal_lahir,
      created_at: mahasiswa.created_at,
      updated_at: mahasiswa.updated_at,
    };
  }

  async create(
    CreateMahasiswaDto: CreateMahasiswaDto,
  ): Promise<MahasiswaResponseDto> {
    try {
      const { nim, nama, email, jurusan, tanggal_lahir, is_active } =
        CreateMahasiswaDto;
      const [mahasiswa] = await this.knex
        .connection('data_mhs')
        .insert({
          nim,
          nama,
          email,
          jurusan,
          tanggal_lahir,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_active,
        })
        .returning('*');
      return this.mapToMahasiswaResponseDto(mahasiswa);
    } catch (error) {
      throw new Error('Error creating mahasiswa');
    }
  }

  async findAll(): Promise<MahasiswaResponseDto[]> {
    const mahasiswa = await this.knex
      .connection('data_mhs')
      .select('*')
      .where({ is_active: true });
    return mahasiswa.map(this.mapToMahasiswaResponseDto);
  }

  async update(
    id: number,
    updateMahasiswaDto: Partial<CreateMahasiswaDto>,
  ): Promise<MahasiswaResponseDto> {
    try {
      const { nim, nama, email, jurusan, tanggal_lahir } = updateMahasiswaDto;
      const [mahasiswa] = await this.knex
        .connection('data_mhs')
        .where({ id })
        .update({
          nim,
          nama,
          email,
          jurusan,
          tanggal_lahir,
          updated_at: new Date().toISOString(),
        })
        .returning('*');
      return this.mapToMahasiswaResponseDto(mahasiswa);
    } catch (error) {
      throw new Error('Error updating mahasiswa');
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.knex
        .connection('data_mhs')
        .where({ id })
        .update({ is_active: false, updated_at: new Date().toISOString() });
    } catch (error) {
      throw new Error('Error deleting mahasiswa');
    }
  }
}
