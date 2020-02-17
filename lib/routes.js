var locations = require('./api/v1/locations');

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
  }
];
