
exports.up = function(knex) {
  return knex.schema.table('reports', table => {
    table.integer('location_id').unsigned()
    table.foreign('location_id')
      .references('locations.id')
      .onDelete('CASCADE')
  });
};

exports.down = function(knex) {
  return knex.schema.table('reports', table => {
    table.dropColumn('location_id')
  });
};
