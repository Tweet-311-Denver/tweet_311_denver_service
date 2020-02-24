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



describe('GET /api/v1/reports', () => {
  let server;

  beforeEach(async () => {
      server = await init();
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
    expect(reports[0].category).to.equal("snow_removal")
    expect(reports[0].description).to.equal("Test")
    expect(reports[0].image).to.equal(null)
    expect(reports[0].email).to.equal('test@test.com')
    // expect(reports.length).to.equal(2)
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
    const stub = sinon.stub(puppeteer.methods, 'snowRemoval').callsFake(function fakeFn() {
      return {
        caseID: '2313413',
        category: 'Snow Removal',
        submittedAs: 'test@test.com',
        submittedAt: '2/24 at 1:20',
        notes: 'test'
      }
    })
    const mockRequest = {
      report: {
        category: 'snow_removal',
        description: 'Test',
        image: null,
        email: 'test@test.com'
      },
      location: {
        lat: '176.2423423',
        long: '134.343433'
      }
    };
    const mockOptions = {
      method: 'POST',
      url: '/api/v1/reports',
      payload: mockRequest
    }
    await database('reports').del();
    const res = await server.inject(mockOptions);
    const reports = await database('reports').select();
    expect(res.statusCode).to.equal(201);
    expect(reports.length).to.equal(1);
    expect(stub.called).to.equal(true);
    stub.reset();
  })
});
