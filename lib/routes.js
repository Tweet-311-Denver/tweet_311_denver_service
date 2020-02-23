const locations = require('./api/v1/locations');
const reports = require('./api/v1/reports'); 

module.exports = [
  {
    method: 'GET',
    path: '/api/v1/locations',
    handler: locations.methods.all
  },
  {
    method: 'POST',
    path: '/api/v1/locations',
    handler: locations.methods.create
  },
  {
    method: 'GET',
    path: '/',
    handler: function(request, h) {
      return "hello world"
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
    handler: reports.methods.create
  }
];
