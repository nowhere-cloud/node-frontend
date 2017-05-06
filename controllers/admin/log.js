'use strict';

const express = require('express');
const Router  = express.Router();
const HTTP    = require('../../helpers/promise-http');
const Auth    = require('../../helpers/authenticator');
const Proxy   = require('express-http-proxy');

/**
 * Capitalize First Letter of the given string
 * https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
 * @param {[type]} string [description]
 */
const CapitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

Router.all('*', Auth.Admin.Protection);

/* GET home page. */
Router.get('/', (req, res, next) => {
  res.render('admin/status', {
    breadcrumb: true,
    title: 'System Event Dashboard'
  });
});

Router.get('/all', (req, res, next) => {
  HTTP.GetJSON('http://api:3000/log/').then((rsvp) => {
    res.render('admin/report-syslog', {
      title: 'Report',
      ReportTitle: 'All System Events',
      withLegend: true,
      data: rsvp
    });
  }).catch((err) => {
    return next(err);
  });
});

Router.get('/:type', (req, res, next) => {
  HTTP.GetJSON(`http://api:3000/log/${req.params.type}`).then((rsvp) => {
    res.json(rsvp);
  }).catch((err) => {
    return next(err);
  });
});

Router.get('/:type/:value', (req, res, next) => {
  HTTP.GetJSON(`http://api:3000/log/${req.params.type}/${req.params.value}`).then((rsvp) => {
    res.render('admin/report-syslog', {
      title: 'Report',
      ReportTitle: `System Events Labelled "${CapitalizeFirstLetter(req.params.value)}" at "${CapitalizeFirstLetter(req.params.type)}"`,
      withLegend: !(req.params.type === 'severity'),
      data: rsvp
    });
  }).catch((err) => {
    return next(err);
  });
});

module.exports = Router;
