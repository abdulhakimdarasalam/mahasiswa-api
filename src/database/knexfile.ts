import { Knex } from 'knex';

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: 'localhost',
    user: 'postgres',
    password: '12345678',
    database: 'postgres',
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',
  },
};
export default config;
