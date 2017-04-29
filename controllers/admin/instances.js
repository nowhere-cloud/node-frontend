'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');
const HTTP      = require('../../helpers/promise-http');

Router.all('*', Auth.Admin.Protection);

Router.get('/', (req, res, next) => {
  res.render('admin/instances', {
    title: 'Virtual Machines',
    breadcrumb: true
  });
});

Router.get('/partials/vm-list-hyp', (req, res, next) => {
  HTTP.GetJSON('http://api:3000/xen/vm/').then((data) => {
    res.render('_partials/vm-partials/vm-list', {
      data: data
    });
  }).catch((e) => {
    return next(e);
  });
});

Router.get('/partials/vmtpl-list-hyp', (req, res, next) => {
  HTTP.GetJSON('http://api:3000/xen/vm/templates').then((data) => {
    res.render('_partials/vm-partials/tpl-list', {
      data: data
    });
  }).catch((e) => {
    return next(e);
  });
});

Router.get('/partials/net-list-hyp', (req, res, next) => {
  HTTP.GetJSON('http://api:3000/xen/net/').then((data) => {
    res.render('_partials/vm-partials/net-list', {
      data: data
    });
  }).catch((e) => {
    return next(e);
  });
});

Router.get('/partials/vif-list-hyp', (req, res, next) => {
  HTTP.GetJSON('http://api:3000/xen/vif/').then((data) => {
    res.render('_partials/vm-partials/vif-list', {
      data: data
    });
  }).catch((e) => {
    return next(e);
  });
});

Router.use('/api', require('./instances-api'));

module.exports = Router;
