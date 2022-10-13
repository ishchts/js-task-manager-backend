/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('task_status').del();
  await knex('task_status').insert([
    { id: 1, name: 'новый' },
    { id: 2, name: 'в работе' },
    { id: 3, name: 'на тестировании' },
    { id: 4, name: 'завершен' },
  ]);
};
