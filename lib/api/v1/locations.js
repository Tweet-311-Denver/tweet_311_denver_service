var models = require('../../../db/models');

exports.methods = {
  all: async function(request, reply) {
    const locs = await models.Location.findAll().then(locations => locations)
    return reply.response(locs).code(200)
  },
  create: async function(request, reply) {
    const addLoc = request.payload
    const newLoc = await models.Location.create(addLoc).then(loc=>loc)
    return reply.response({"message": "Success", newLoc}).code(201)
  }
};
