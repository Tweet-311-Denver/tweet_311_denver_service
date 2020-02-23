'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../lib/server');
const Geocode = require ('../lib/services/googleGeocode')

describe ("Google Geocode Service", () => {
  it('responds google information', async () => {
      const address = new Geocode({lat: 39.751129, long: -104.997486})
      const googleInfo = await address.fetchAddress()

      expect(googleInfo.status).to.equal("OK");
      expect(googleInfo.results[0].formatted_address).to.equal("1434 17th St, Denver, CO 80202, USA")
  })
})
