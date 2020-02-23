import { abandonedCarForm, snowRemoval, illegalParking, otherForm } from '../../../puppeteer';
const env = process.env.NODE_ENV || 'development';
const configuration = require('../../../knexfile')[env];
const knex = require('knex')(configuration);

exports.methods = {
  all: async function(request, reply) {
    const reports = await knex('reports').select().then(reports=>reports)
    const displayReports = reports.map(report => ({
      id: report.id,
      category: report.category,
      description: report.description,
      image: report.image,
      email: report.email,
      location_id: report.location_id
    }))
    return reply.response(displayReports).code(200)
  },
  create: async function(request, reply) {
    let confirmation;
    const { report, location } = request.payload;
    const fullLocation = {
      lat: location.lat,
      long: location.lon,
      address_desc: '1801 16th st'
    };
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
      confirmation = await snowRemoval(puppeteerOptions)
    } else {
      confirmation = await otherForm(puppeteerOptions)
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
  }
};
