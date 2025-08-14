exports.up = async function (knex) {
  await knex.schema.createTable('crawls', (table) => {
    table.increments('id').primary();
    table.uuid('uuid');
    table.string('base_url').notNullable();
    table.text('started_at');
    table.text('ended_at').nullable();
  });

  await knex.schema.createTable('pages', (table) => {
    table.uuid('id').primary();
    table
      .integer('crawl_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('crawls')
      .onDelete('CASCADE');

    table.string('url').notNullable();

    table.text('title');
    table.text('violations');
    table.text('incomplete');
    table.text('scan_error');
    table.text('scanned_at');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('pages');
  await knex.schema.dropTableIfExists('crawls');
};
