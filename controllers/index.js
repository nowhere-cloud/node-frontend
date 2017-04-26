'use strict';

const express = require('express');
const Proxy   = require('express-http-proxy');
const Router  = express.Router();

/* GET home page. */
Router.get('/', (req, res, next) => {
  res.render('index', {
    breadcrumb: false,
    title: 'Home'
  });
});

// Systm Status
Router.use('/status', require('./status'));

// Users UX
Router.use('/users', require('./users/'));

// Admin UX
Router.use('/admin', require('./admin/'));

// Knowledge Base
Router.use('/help', require('./help'));

module.exports = Router;
