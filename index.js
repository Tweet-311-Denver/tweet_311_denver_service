'use strict';
require('dotenv').config();
const env = process.env.NODE_ENV || 'development';
const configuration = require('./knexfile')[env];

const { start } = require('./lib/server');

start();
