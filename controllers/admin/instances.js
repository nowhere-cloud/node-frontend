'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');
const HTTP      = require('../../helpers/promise-http');

Router.all('*', Auth.User.Protection);

Router.get('/', (req, res, next) => {
  res.render('admin/instances', {
    title: 'Virtual Machines',
    breadcrumb: true
  });
});

Router.get('/partials/vm-list', (req, res, next) => {
  HTTP.GetJSON('http://api-gate:3000/xen/vm/').then((data) => {
    res.render('admin/_partials/vm-partials/list', {
      data: data
    });
  });
});

module.exports = Router;
