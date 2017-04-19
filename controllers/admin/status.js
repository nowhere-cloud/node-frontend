'use strict';

const express = require('express');
const Router  = express.Router();

/* GET home page. */
Router.get('/', (req, res, next) => {
  res.render('admin/status', {
    breadcrumb: true,
    title: 'Syslog Dashboard'
  });
});

module.exports = Router;
