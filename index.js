'use strict';

const Hapi = require('hapi');
var models = require('./models');

const init = async () => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route(require('./lib/routes'));

    models.sequelize.sync().then(function() {
      server.start(function() {
        console.log('Running on 3000');
      });
    });
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();
