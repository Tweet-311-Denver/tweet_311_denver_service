const env = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[env];
const knex = require('knex')(configuration);

exports.methods = {
  all: async function(request, reply) {
    const locs = await knex('locations').select().then(locations=>locations)
    console.log("locations in db", locs)
    return reply.response(locs).code(200)
  },
  create: async function(request, reply) {
    const addLoc = request.payload
    const newLoc = await knex('locations').insert(addLoc, ['id', 'address_desc'])
    console.log("newLoc", newLoc)
    console.log("newLoc address_desc", newLoc[0].address_desc)
    return reply.response({"message": `Success ${newLoc[0].address_desc} addded`}).code(201)
  }
};
