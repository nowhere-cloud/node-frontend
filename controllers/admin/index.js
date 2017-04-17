'use strict';

const Express = require('express');
const Router  = Express.Router();

Router.use('/auth', require('./auth'));

module.exports = Router;
