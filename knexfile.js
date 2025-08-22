/** @type {import('knex').Knex.Config} */

module.exports = {
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3',
    },
    useNullAsDefault: true,
    pool: {
        afterCreate: (conn, done) => {
            conn.run('PRAGMA foreign_keys = ON', done);
        },
    },
    migrations: {
        directory: './db/migrations',
    },
    seeds: {
        directory: './db/seeds',
    },
};
