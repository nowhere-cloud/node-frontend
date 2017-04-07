'use strict';

const express = require('express');
const Proxy   = require('express-http-proxy');
const Router  = express.Router();
const Model   = require('../models');

/* GET home page. */
Router.get('/', (req, res, next) => {
  res.render('status', {
    breadcrumb: true,
    title: 'System Status'
  });
});

Router.get('/api/umeda', Proxy('http://api:3000/', {
  forwardPath: (req, res) => {
    return '/stats';
  },
  limit: '1mb',
  timeout: 30*1000
}));

Router.get('/api/tonda', Proxy('http://api:3000/', {
  forwardPath: (req, res) => {
    return '/xen/stats/api';
  },
  limit: '1mb',
  timeout: 30*1000
}));

Router.get('/api/ikeda', Proxy('http://api:3000/', {
  forwardPath: (req, res) => {
    return '/xen/stats/xen';
  },
  limit: '1mb',
  timeout: 30*1000
}));

Router.get('/api/suita', Proxy('http://api:3000/', {
  forwardPath: (req, res) => {
    return '/dns/stats';
  },
  limit: '1mb',
  timeout: 30*1000
}));

Router.get('/api/yamada', (req, res, next) => {
  Model.sequelize.authenticate().then(() => {
    res.sendStatus(200);
  }).catch(() => {
    res.sendStatus(500);
  });
});

Router.get('/api/sonoda', Proxy('http://api:3000/', {
  forwardPath: (req, res) => {
    return '/log/stats';
  },
  limit: '1mb',
  timeout: 30*1000
}));

Router.get('/api/ikoma', Proxy('http://api:3000/', {
  forwardPath: (req, res) => {
    return '/log/severity';
  },
  limit: '1mb',
  timeout: 30*1000
}));

module.exports = Router;
