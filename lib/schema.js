const Joi = require('@hapi/joi');
require('dotenv').config();

const schema = Joi.object({
  serviceKey: Joi.string().required().valid(process.env.SERVICE_KEY)
})

module.exports = schema;
