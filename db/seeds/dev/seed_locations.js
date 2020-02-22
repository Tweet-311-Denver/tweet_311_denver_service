exports.seed = function(knex) {
  // We must return a Promise from within our seed function
  // Without this initial `return` statement, the seed execution
  // will end before the asynchronous tasks have completed
  return knex('locations').del() // delete all locations
    // Now that we have a clean slate, we can re-insert our locations data
    .then(() => {
      return Promise.all([

        // Insert a single paper, return the paper ID, insert 2 footnotes
        knex('locations').insert([
          { lat: 39.751129, long: -104.997486, address_desc: '1701 Market St'},
          { lat: 39.752793, long: -104.980223, address_desc: '588-530 25th St, Denver, CO 80205'},
        ], 'id')
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) // end return Promise.all
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
