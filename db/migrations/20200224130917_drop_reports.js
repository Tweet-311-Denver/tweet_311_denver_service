
exports.up = function(knex) {
  return knex.schema.table('reports', table => {
    table.dropColumn('location_id');
  })
};

exports.down = function(knex) {
  return knex.schema.table('reports', table => {
    table.integer('location_id').unsigned().notNullable();
    table.foreign('location_id')
      .references('id').inTable('locations')
  });
};
