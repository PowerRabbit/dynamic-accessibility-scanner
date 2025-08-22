import knex from 'knex';
import type { Knex } from 'knex';
import { Database } from 'sqlite3';

const config: Knex.Config = {
  client: 'sqlite3',
  connection: {
    filename: './dev.sqlite3',
  },
  useNullAsDefault: true,
  pool: {
        afterCreate: (conn: Database, done: (err: Error | null, db?: Database) => void) => {
            conn.run('PRAGMA foreign_keys = ON', done);
        },
    },
};

const db = knex(config);
db.raw('PRAGMA foreign_keys = ON');

export default db;
