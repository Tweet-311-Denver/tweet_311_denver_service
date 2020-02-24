
exports.up = function(knex) {
  return Promise.all([
    knex.schema.alterTable('locations', function(table) {
      table.decimal('lat', 12, 8).alter();
      table.decimal('long', 12, 8).alter();
    })
  ])
};

exports.down = function(knex) {
  return Promise.all([
    knex.schema.alterTable('locations', function(table) {
      table.decimal('lat', 10, 6).alter();
      table.decimal('long', 10, 6).alter();
    })
  ])
};
