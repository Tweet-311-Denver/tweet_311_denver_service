exports.seed = function(knex) {
  return knex('locations').del()
    .then(() => {
      return Promise.all([
        knex('locations').insert([
          { lat: 39.751129, long: -104.997486, address_desc: '1701 Market St'},
          { lat: 39.752793, long: -104.980223, address_desc: '588-530 25th St, Denver, CO 80205'},
        ], 'id')
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ])
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
