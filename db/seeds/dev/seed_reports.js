exports.seed = function(knex) {
  return knex('reports').del() // delete all locations
    .then( async () => {
      const locations = await knex('locations').select('id')
      const locOne = locations[0].id
      const reports = await knex('reports').insert([
          { category: 'other', description: 'big hole', email: 'test@test.com', location_id: locOne},
          { category: 'other', description: 'oh noes', email: 'test2@test.com', location_id: locOne}
        ], 'id')
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
