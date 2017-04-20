'use strict';

const express = require('express');
const Router  = express.Router();
const HTTP    = require('../../helpers/promise-http');
const StrDate = require('../../assets/javascripts/Date');

/**
 * Capitalize First Letter of the given string
 * https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
 * @param {[type]} string [description]
 */
const CapitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

/* GET home page. */
Router.get('/', (req, res, next) => {
  res.render('admin/status', {
    breadcrumb: true,
    title: 'Syslog Dashboard'
  });
});

Router.get('/all', (req, res, next) => {
  let DateString = new StrDate();
  HTTP.GetJSON('http://api:3000/log/').then((rsvp) => {
    res.render('admin/report', {
      title: 'Report',
      ReportTitle: 'All System Events',
      withLegend: true,
      data: rsvp,
      date: `${DateString.getTodayDate()} @ ${DateString.getCurrentTime()}`
    });
  }).catch((err) => {
    return next(err);
  });
});

Router.get('/severity/:severity', (req, res, next) => {
  let DateString = new StrDate();
  HTTP.GetJSON(`http://api:3000/log/severity/${req.params.severity}`).then((rsvp) => {
    res.render('admin/report', {
      title: 'Report',
      ReportTitle: `All System Events Labelled ${CapitalizeFirstLetter(req.params.severity)}`,
      withLegend: true,
      data: rsvp,
      date: `${DateString.getTodayDate()} @ ${DateString.getCurrentTime()}`
    });
  }).catch((err) => {
    return next(err);
  });
});

module.exports = Router;
