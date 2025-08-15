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
    table.integer('violations_amount');
    table.integer('incomplete_amount');
    table.text('scan_error');
    table.text('scanned_at');
  });

  await knex.schema.createTable('page_data', (table) => {
      table
        .integer('page_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('pages')
        .onDelete('CASCADE');

      table.text('violations');
      table.text('incomplete');
    });
};


exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('page_data');
  await knex.schema.dropTableIfExists('pages');
  await knex.schema.dropTableIfExists('crawls');
};
