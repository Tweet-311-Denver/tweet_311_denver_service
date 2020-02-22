'use strict';

const Hapi = require('@hapi/hapi');
var port = process.env.PORT || 3000;

const server = Hapi.server({
    port: port,
    host: process.env.HOST || 'localhost'
});

server.route(require('./routes'));

exports.init = async () => {

    await server.initialize();
    return server;
};

exports.start = async () => {

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
    return server;
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});
