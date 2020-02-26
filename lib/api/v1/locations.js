const env = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[env];
const knex = require('knex')(configuration);

exports.methods = {
  all: async function(request, reply) {
    const locs = await knex('locations').select().then(locations=>locations)
    return reply.response(locs).code(200)
  }
};
