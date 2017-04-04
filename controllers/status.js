'use strict';

const express = require('express');
const Proxy   = require('express-http-proxy');
const Router = express.Router();

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

Router.get('/api/namba', Proxy('http://api:3000/', {
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

Router.get('/api/yamada', Proxy('http://api:3000/', {
  forwardPath: (req, res) => {
    return '/dns/stats';
  },
  limit: '1mb',
  timeout: 30*1000
}));

Router.get('/api/nigawa', Proxy('http://api:3000/', {
  forwardPath: (req, res) => {
    return '/log/stats';
  },
  limit: '1mb',
  timeout: 30*1000
}));

Router.get('/api/yamato-saidaiji', Proxy('http://api:3000/', {
  forwardPath: (req, res) => {
    return '/log/severity';
  },
  limit: '1mb',
  timeout: 30*1000
}));

module.exports = Router;
