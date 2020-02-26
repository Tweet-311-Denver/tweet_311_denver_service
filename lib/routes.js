const reports = require('./api/v1/reports');
const Joi = require('@hapi/joi');


module.exports = [
  {
    method: 'GET',
    path: '/',
    handler: function(request, h) {
      return {
        message: 'Welcome to Tweet311Denver Service',
        documentation: 'https://github.com/Tweet-311-Denver/tweet_311_denver_service'
      }
    }
  },
  {
    method: 'GET',
    path: '/api/v1/reports',
    handler: reports.methods.all
  },
  {
    method: 'POST',
    path: '/api/v1/reports',
    handler: reports.methods.create,
    options: {
        validate: {
            query: Joi.object({
                serviceKey: Joi.string().required().valid(process.env.SERVICE_KEY)
            })
        }
    }
  }
];
