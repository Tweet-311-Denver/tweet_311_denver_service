'use strict';
require('dotenv').config();

const configuration = require('./knexfile')[environment];

const { start } = require('./lib/server');

start();
