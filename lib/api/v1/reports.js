const env = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[env];
const knex = require('knex')(configuration);
const puppeteer = require('../../../puppeteer');
const Geocode = require('../../../lib/services/geocode');

exports.methods = {
  all: async function(request, reply) {
   try {
    const reports = await knex('reports').select().then(reports=>reports)
    const displayReports = reports.map(report => ({
      id: report.id,
      category: report.category,
      description: report.description,
      image: report.image,
      email: report.email,
      location_id: report.location_id
    }));
    return reply.response({ reports: displayReports }).code(200)
   } catch (err) {
     return reply.response({ error: err }).code(500)
   }
  },
  create: async function(request, reply) {
    let confirmation;
    const { report, location } = request.payload;

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

    const googleInfo = new Geocode(location);
    const address = await googleInfo.fetchAddress();
    const fullLocation = {
      lat: location.lat,
      long: location.long,
      address_desc: address.results[0].formatted_address
    };

    try {
      const locationID = await knex('locations').insert(fullLocation, ['id']);
      const fullReport = {
        category: report.category,
        description: report.description,
        image: report.image,
        email: report.email,
        location_id: locationID[0].id
      };
      const newReport = await knex('reports').insert(fullReport, 'id');
      const puppeteerOptions = {
        description: report.description,
        email: report.email,
        address: fullLocation.address_desc
      };

      if (report.category === 'snow_removal') {
        confirmation = await puppeteer.methods.snowRemoval(puppeteerOptions)
      } else {
        confirmation = await puppeteer.methods.otherForm(puppeteerOptions)
      };
      const replyReport = {
        newReport: {
          ...fullReport,
          id: newReport[0]
        },
        confirmation311: {
          ...confirmation
        }
      };

    return reply.response(replyReport).code(201)
  } catch (err) {
    reply.response({error}).code(500)
    }
  }
};
