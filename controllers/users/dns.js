'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Sanitizer = require('sanitizer');
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
  HTTP.GetJSON(`http://api-gate:3000/dns/search/byuser/${req.user}`).then((data) => {
    res.render('user/_partials/dns/dns-table', {
      payload: data
    });
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/', (req, res, next) => {
  HTTP.PostJSON('http://api-gate:3000/dns/create', {
    type: Sanitizer.sanitize(req.body.type),
    name: Sanitizer.sanitize(req.body.name),
    ipv4address: Sanitizer.sanitize(req.body.ip4),
    ipv6address: Sanitizer.sanitize(req.body.ip6),
    cname: Sanitizer.sanitize(req.body.opt),
    UserId: req.user
  }).then((data) => {
    res.json(data);
  }).catch((err) => {
    return next(err);
  });
});

module.exports = Router;
