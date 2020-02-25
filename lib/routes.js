const locations = require('./api/v1/locations');
const reports = require('./api/v1/reports');
const Joi = require('@hapi/joi');
const schema = require('./schema');
const puppeteer = require('puppeteer');


module.exports = [
  {
    method: 'GET',
    path: '/api/v1/locations',
    handler: locations.methods.all
  },
  {
    method: 'POST',
    path: '/api/v1/locations',
    handler: locations.methods.create,
    options: {
        validate: {
            query: Joi.object({
                serviceKey: Joi.string().required().valid(process.env.SERVICE_KEY)
            })
        }
    }
  },
  {
    method: 'GET',
    path: '/',
    handler: function(request, h) {
      return 'Welcome to Tweet311Denver Service'
    },
    options: {
        validate: {
            query: Joi.object({
                serviceKey: Joi.string().required().valid(process.env.SERVICE_KEY)
            })
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
  },
  {
    method: 'POST',
    path: '/api/v1/test/reports',
    handler: async function(request, reply) {
      const { report, location } = request.payload;
      const browser = await puppeteer.launch({args: ['--no-sandbox']});
      const page = await browser.newPage();
  
      await page.goto('https://www.denvergov.org/pocketgov/#/report-a-problem', {waitUntil: 'networkidle2'});
      await page.waitFor(10000);
      await browser.close();

      for (let requiredParameter of ['category', 'description', 'image', 'email']) {
        if (!report.hasOwnProperty(requiredParameter)) {
          return reply.response({ error: `The expected format is: {report: { category: <String>, description: <String>, image: <String>, email: <String> }}. You're missing the ${requiredParameter} property.`}).code(422)
        }
      };

      for (let requiredParameter of ['lat', 'long']) {
        if (!location.hasOwnProperty(requiredParameter)) {
          return reply.response({ error: `The expected format is: {location: { lat: <String>, long: <String> }}. You're missing the ${requiredParameter} property.`}).code(422)
        }
      };
      const replyReport = {
        report: {
          category: report.category,
          description: report.description,
          image: report.image,
          email: report.email,
          location_id: 34,
          id: 2
        },
        confirmation311: {
          caseID: '13344',
          category: report.category,
          submittedAs: report.email,
          submittedAt: '2/22 at 1:20pm',
          notes: report.description
        }
      };
      
      return reply.response(replyReport).code(201)
    },
    options: {
      validate: {
          query: Joi.object({
              serviceKey: Joi.string().required().valid(process.env.SERVICE_KEY)
          })
      }
  }
  }
];
