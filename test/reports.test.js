'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../lib/server');
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)
const sinon = require('sinon');
const puppeteer = require('../puppeteer');
const nock = require('nock')
const googleResponse = require('./googleResponse')


describe('GET /api/v1/reports', () => {
  let server;
  
  describe('GET /', () => {
    it('responds with 200', async () => {
      const reply = {
        message: 'Welcome to Tweet311Denver Service',
        documentation: 'https://github.com/Tweet-311-Denver/tweet_311_denver_service'
      }
      const res = await server.inject({
          method: 'get',
          url: '/'
      });
      const actualReply = JSON.parse(res.payload);
      expect(res.statusCode).to.equal(200);
      expect(actualReply).to.equal(reply);
    });
  });

  beforeEach(async () => {
      server = await init();
      await database.seed.run();

  });

  afterEach(async () => {
      await server.stop();
  });

  it('should respond with a 200 status code', async () => {
    const res = await server.inject({
      method: 'GET',
      url: '/api/v1/reports'
    });

    expect(res.statusCode).to.equal(200);
    const data = JSON.parse(res.payload)
    const reports = data.reports
    expect(reports[0].category).to.equal('other')
    expect(reports[0].description).to.equal('big hole')
    expect(reports[0].image).to.equal(null)
    expect(reports[0].email).to.equal('test@test.com')
  });
});

describe('POST /api/v1/reports', () => {
  let server;

  beforeEach(async () => {
    server = await init();
  });

  afterEach(async () => {
    await server.stop();
  });

  it('should post a new report to the database', async () => {
    await database('reports').select().del()
    await database('locations').select().del()
    const reportsInDb = await database('reports').select();
    const stub = sinon.stub(puppeteer.methods, 'snowRemoval').callsFake(function fakeFn() {
      return {
        caseID: '2313413',
        category: 'Snow Removal',
        submittedAs: 'test@test.com',
        submittedAt: '2/24 at 1:20',
        notes: 'test'
      }
    });
    const mockRequest = {
      report: {
        category: 'snow_removal',
        description: 'Test',
        image: null,
        email: 'test@test.com'
      },
      location: {
        lat: 39.7482157,
        long: -105.0005148
      }
    };
    const mockOptions = {
      method: 'POST',
      url: `/api/v1/reports?serviceKey=${process.env.SERVICE_KEY}`,
      payload: mockRequest
    }

    const latLongString = `${mockRequest.location.lat},${mockRequest.location.long}`

    const mockGoogle = nock('https://maps.googleapis.com')
      .get('/maps/api/geocode/json')
      .query({ latlng: latLongString, key: process.env.GOOGLE_GEOCODE_KEY })
      .reply(200, googleResponse)


    const res = await server.inject(mockOptions);
    const reports = await database('reports').select();
    expect(res.statusCode).to.equal(201);
    expect(reports.length).to.equal(1);
    expect(stub.called).to.equal(true);
    stub.reset();
    stub.restore('snowRemoval');
  });

  it('should post a new report, but not a new location to the database', async () => {
    await database('reports').select().del()
    const locationsStart = await database('locations').select();

    const reportsInDb = await database('reports').select();
    const stub = sinon.stub(puppeteer.methods, 'snowRemoval').callsFake(function fakeFn() {
      return {
        caseID: '2313413',
        category: 'Snow Removal',
        submittedAs: 'test@test.com',
        submittedAt: '2/24 at 1:20',
        notes: 'test'
      }
    });
    const mockRequest = {
      report: {
        category: 'snow_removal',
        description: 'Test',
        image: null,
        email: 'test@test.com'
      },
      location: {
        lat: 39.7482157,
        long: -105.0005148
      }
    };
    const mockOptions = {
      method: 'POST',
      url: `/api/v1/reports?serviceKey=${process.env.SERVICE_KEY}`,
      payload: mockRequest
    }

    const latLongString = `${mockRequest.location.lat},${mockRequest.location.long}`

    const mockGoogle = nock('https://maps.googleapis.com')
      .get('/maps/api/geocode/json')
      .query({ latlng: latLongString, key: process.env.GOOGLE_GEOCODE_KEY })
      .reply(200, googleResponse)


    const res = await server.inject(mockOptions);
    const reports = await database('reports').select();
    const locationsNoDuplicates = await database('locations').select();

    expect(locationsNoDuplicates.length).to.equal(locationsStart.length)

    expect(res.statusCode).to.equal(201);
    expect(reports.length).to.equal(1);
    expect(stub.called).to.equal(true);
    stub.reset();
    stub.restore('snowRemoval');

  });



  it('should return a 422 code if request body is incomplete', async () => {
    const mockRequest = {
      report: {
        category: 'other',
        description: 'big hole',
        email: 'test@test.com'
      },
      location: {
        lat: '176.2423423',
        long: '134.343433'
      }
    };
    const mockOptions = {
      method: 'POST',
      url: `/api/v1/reports?serviceKey=${process.env.SERVICE_KEY}`,
      payload: mockRequest
    };
    const res = await server.inject(mockOptions);
    expect(res.statusCode).to.equal(422);
  })

  it('should return a 400 code if serviceKey is not included or wrong', async () => {
    const mockRequest = {
      report: {
        category: 'other',
        description: 'big hole',
        email: 'test@test.com'
      },
      location: {
        lat: '176.2423423',
        long: '134.343433'
      }
    };
    const mockOptions = {
      method: 'POST',
      url: `/api/v1/reports?serviceKey=notCorrect`,
      payload: mockRequest
    };
    const res = await server.inject(mockOptions);
    expect(res.statusCode).to.equal(400);

    const mockOptions2 = {
      method: 'POST',
      url: `/api/v1/reports`,
      payload: mockRequest
    };
    const res2 = await server.inject(mockOptions2);
    expect(res2.statusCode).to.equal(400);
  })
});
