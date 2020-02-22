
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('locations', function(table) {
      table.increments('id').primary();
      table.decimal('lat');
      table.decimal('long');
      table.string('address_desc');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.dropTable('locations')
  ]);
};
