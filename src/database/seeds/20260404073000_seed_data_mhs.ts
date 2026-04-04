import type { Knex } from 'knex';

const jurusanList = [
  'Informatika',
  'Sistem Informasi',
  'Teknik Elektro',
  'Manajemen',
] as const;

export async function seed(knex: Knex): Promise<void> {
  await knex('data_mhs').del();

  const rows = Array.from({ length: 100 }, (_, index) => {
    const num = index + 1;
    const padded = String(num).padStart(3, '0');

    return {
      nim: `12322${String(num).padStart(4, '0')}`,
      nama: `Mahasiswa ${padded}`,
      email: `mahasiswa${padded}@example.com`,
      jurusan: jurusanList[index % jurusanList.length],
      tanggal_lahir: `2000-01-${String((index % 28) + 1).padStart(2, '0')}`,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  });

  await knex('data_mhs').insert(rows);
}
