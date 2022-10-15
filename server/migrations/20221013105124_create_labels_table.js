export const up = (knex) => (
  knex.schema.createTable('labels', (table) => {
    table.increments('id').primary();
    table.string('name');
    table.timestamp('created_at').defaultTo(knex.fn.now());
  })
);

export const down = (knex) => (
  knex.schema.dropTable('labels')
);
