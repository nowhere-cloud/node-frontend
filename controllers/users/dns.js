'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Sanitizer = require('sanitizer');
const Auth      = require('../../helpers/authenticator');
const HTTP      = require('../../helpers/promise-http');

let MockData = [
  {
    id: 0,
    type: 'A',
    name: 'testdomain',
    ipv4address: '128.56.0.1',
    ipv6address: '::FFFF:8038:1',
    cname: ''
  },
  {
    id: 1,
    type: 'CNAME',
    name: 'testdomain2',
    ipv4address: '',
    ipv6address: '',
    cname: 'www.example.com'
  }
];

Router.all('*', Auth.UserProtector);

Router.get('/', (req, res, next) => {
  res.render('user/dns', {
    title: 'DNS Configuration',
    csrfToken: req.csrfToken(),
    errorMessage: req.flash('error'),
    successMessage: req.flash('success'),
    breadcrumb: true
  });
});

Router.get('/partials/list', (req, res, next) => {
  // HTTP.GetJSON(`http://api-gate:3000/dns/search/byuser/${req.user}`).then((data) => {
  //   res.render('user/_partials/dns-table', {
  //     payload: data
  //   });
  // }).catch((err) => {
  //   return next(err);
  // });
  res.render('user/_partials/dns-table', {
    payload: MockData
  });
});

Router.get('/partials/form/:entryID', (req, res, next) => {
  // HTTP.GetJSON(`http://api-gate:3000/dns/${req.params.entryID}`).then((data) => {
  //   res.render('user/_partials/dns-edit-form', {
  //     csrfToken: req.csrfToken(),
  //     payload: data
  //   });
  // }).catch((err) => {
  //   return next(err);
  // });
  res.render('user/_partials/dns-edit-form', {
    csrfToken: req.csrfToken(),
    payload: MockData[req.params.entryID]
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
    req.flash('success', `DNS Entry ${data.type} - ${data.name} Created.`);
    res.redirect('/users/dns');
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/patch/:id', (req, res, next) => {
  HTTP.PatchJSON(`http://api-gate:3000/dns/${Sanitizer.sanitize(req.params.id)}`, {
    type: Sanitizer.sanitize(req.body.type),
    name: Sanitizer.sanitize(req.body.name),
    ipv4address: Sanitizer.sanitize(req.body.ip4),
    ipv6address: Sanitizer.sanitize(req.body.ip6),
    cname: Sanitizer.sanitize(req.body.opt)
  }).then((data) => {
    res.json(data);
  }).catch((err) => {
    return next(err);
  });
});

module.exports = Router;
