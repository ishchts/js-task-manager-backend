/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('labels').del();
  await knex('labels').insert([
    { id: 1, name: 'bug' },
    { id: 2, name: 'documentation' },
    { id: 3, name: 'enhancement' },
    { id: 4, name: 'help wanted' },
    { id: 5, name: 'invalid' },
    { id: 6, name: 'question' },
    { id: 7, name: 'wontfix' },
  ]);
};
