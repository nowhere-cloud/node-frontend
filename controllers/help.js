'use strict';

const Express = require('express');
const Router  = Express.Router();

Router.get('/', (req, res, next) => {
  res.render('help', {
    title: 'Knowledge Base',
    breadcrumb: true
  });
});

module.exports = Router;
