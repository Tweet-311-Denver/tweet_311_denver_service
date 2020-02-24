'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../lib/server');
const Geocode = require ('../lib/services/geocode')
const nock = require('nock')
const googleResponse = require('./googleResponse')


describe ("Google Geocode Service", () => {
  it('responds google information', async () => {
      const latLong = {lat: 39.751129, long: -104.997486}
      const address = new Geocode(latLong)
      const latLongString = `${latLong.lat},${latLong.long}`

      const mockGoogle = nock('https://maps.googleapis.com')
        .get('/maps/api/geocode/json')
        .query({ latlng: latLongString, key: process.env.GOOGLE_GEOCODE_KEY })
        .reply(200, googleResponse)

      const googleInfo = await address.fetchAddress()

      // test nock is mocking
      expect(googleInfo.results.length).to.equal(1)
      // test google
      expect(googleInfo.status).to.equal("OK");
      expect(googleInfo.results[0].formatted_address).to.equal("1434 17th St, Denver, CO 80202, USA")
  })
})
