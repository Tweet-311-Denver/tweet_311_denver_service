'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('locations', [
      { lat: 39.751129, long: -104.997486, address_desc: "1701 Market St" },
      { lat: 39.752793, long: -104.980223, address_desc: "588-530 25th St, Denver, CO 80205" }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('locations', null, {});
  }
};
