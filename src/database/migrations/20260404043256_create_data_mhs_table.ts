import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('data_mhs', (table) => {
    table.increments('id').primary();
    table.string('nim', 20).notNullable().unique();
    table.string('nama', 100).notNullable();
    table.string('email', 100).notNullable().unique();
    table
      .enum('jurusan', [
        'Informatika',
        'Sistem Informasi',
        'Teknik Elektro',
        'Manajemen',
      ])
      .notNullable();
    table.date('tanggal_lahir').nullable();
    table.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now());
    table.timestamp('updated_at', { useTz: true }).defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('data_mhs');
}
