import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 150).notNullable().unique();
    table.string('name', 150).notNullable();
    table.string('password', 255);
    table.boolean('is_active').notNullable();
    table.timestamp('register_date', { useTz: false });
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('users');
}
