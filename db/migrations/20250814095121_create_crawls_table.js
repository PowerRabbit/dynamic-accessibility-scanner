exports.up = async function (knex) {
  await knex.schema.createTable('crawls', (table) => {
    table.string('uuid', 36).primary();
    table.string('base_url').notNullable();
    table.timestamp('started_at');
    table.timestamp('ended_at').nullable();
  });

  await knex.schema.createTable('pages', (table) => {
    table.string('uuid', 36).primary();
    table.string('crawl_uuid', 36)
      .notNullable()
      .references('uuid')
      .inTable('crawls')
      .onDelete('CASCADE');

    table.string('url').notNullable();
    table.text('title');
    table.integer('violations_amount');
    table.integer('incomplete_amount');
    table.text('scan_error');
    table.timestamp('scanned_at');
  });

  await knex.schema.createTable('page_data', (table) => {
    table.string('page_uuid', 36)
      .notNullable()
      .references('uuid')
      .inTable('pages')
      .onDelete('CASCADE');
    table.primary(['page_uuid']);

    table.text('violations');
    table.text('incomplete');
  });
};

exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('page_data');
  await knex.schema.dropTableIfExists('pages');
  await knex.schema.dropTableIfExists('crawls');
};
