'use strict';

const Lab = require('@hapi/lab');
const { expect } = require('@hapi/code');
const { afterEach, beforeEach, describe, it } = exports.lab = Lab.script();
const { init } = require('../lib/server');

describe('GET /', () => {
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
            url: '/'
        });
        expect(res.statusCode).to.equal(200);
        expect(res.payload).to.equal("hello world");
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

        expect(locations[0].address_desc).to.equal("1701 Market St")
        expect(locations[0].lat).to.equal("39.751129")
        expect(locations[0].long).to.equal("-104.997486")
        expect(locations.length).to.equal(2)
    });
});
