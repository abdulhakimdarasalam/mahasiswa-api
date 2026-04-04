import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('data_mhs', 'is_active');

  if (!hasColumn) {
    await knex.schema.alterTable('data_mhs', (table) => {
      table.boolean('is_active').notNullable().defaultTo(true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  const hasColumn = await knex.schema.hasColumn('data_mhs', 'is_active');

  if (hasColumn) {
    await knex.schema.alterTable('data_mhs', (table) => {
      table.dropColumn('is_active');
    });
  }
}
