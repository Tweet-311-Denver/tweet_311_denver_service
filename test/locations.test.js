'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../lib/server');
const environment = process.env.NODE_ENV || 'development'
const configuration = require('../knexfile')[environment]
const database = require('knex')(configuration)


describe('GET /', () => {
    let server;

    beforeEach(async () => {
        server = await init();
        await database.seed.run();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('responds with 200', async () => {
        const res = await server.inject({
            method: 'get',
            url: `/?serviceKey=${process.env.SERVICE_KEY}`
        });
        expect(res.statusCode).to.equal(200);
        expect(res.payload).to.equal('Welcome to Tweet311Denver Service');
    });
    it('responds with 400 with wrong serviceKey', async () => {
        const res = await server.inject({
            method: 'get',
            url: `/?serviceKey=notCorrect`
        });
        expect(res.statusCode).to.equal(400);
    });
    it('responds with 400 with no serviceKey', async () => {
        const res = await server.inject({
            method: 'get',
            url: `/`
        });
        expect(res.statusCode).to.equal(400);
    });
});

describe('GET /api/v1/locations', () => {
    let server;

    beforeEach(async () => {
        server = await init();
    });

    afterEach(async () => {
        await server.stop();
    });

    it('responds with 200', async () => {
        const res = await server.inject({
            method: 'get',
            url: '/api/v1/locations'
        });

        expect(res.statusCode).to.equal(200);
        const locations = JSON.parse(res.payload)
        expect(locations[0].address_desc).to.equal("1701 Market St")
        expect(locations[0].lat).to.equal("39.75112900")
        expect(locations[0].long).to.equal("-104.99748600")
        expect(locations.length).to.equal(2)
    });
});
