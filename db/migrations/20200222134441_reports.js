
exports.up = function(knex) {
  return Promise.all([
    knex.schema.createTable('reports', function(table) {
      table.increments('id').primary();
      table.string('category');
      table.string('description', 280);
      table.string('image');
      table.string('email');

      table.integer('location_id').unsigned().notNullable();
      table.foreign('location_id').references('id').inTable('locations');

      table.timestamps(true, true);
    })
  ])
};

exports.down = function(knex) {

};
