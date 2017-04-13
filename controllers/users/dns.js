'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');
const HTTP      = require('../../helpers/promise-http');

Router.all('*', Auth.UserProtector);

Router.get('/', (req, res, next) => {
  res.render('user/dns', {
    title: 'DNS Configuration',
    breadcrumb: true
  });
});

Router.get('/partials/list', (req, res, next) => {
  HTTP.JSON(`http://api-gate:3000/dns/search/byuser/${req.user}`).then((data) => {
    res.render('user/_partials/dns/dns-table', {
      payload: data
    });
  }).catch((err) => {
    return next(err);
  });
});

module.exports = Router;
