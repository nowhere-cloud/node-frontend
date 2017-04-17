'use strict';

const Express = require('express');
const Router = Express.Router();
const Sanitizer = require('sanitizer');
const Auth = require('../../helpers/authenticator');
const HTTP = require('../../helpers/promise-http');

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
  HTTP.GetJSON(`http://api-gate:3000/dns/search/byuser/${req.user}`).then((data) => {
    res.render('user/_partials/dns-table', {
      payload: data
    });
  }).catch((err) => {
    return next(err);
  });
});

Router.get('/partials/form/:entryID((\\d+))', (req, res, next) => {
  HTTP.GetJSON(`http://api-gate:3000/dns/${req.params.entryID}`).then((data) => {
    if (data !== {}) {
      res.render('user/_partials/dns-edit-form', {
        csrfToken: req.csrfToken(),
        payload: data
      });
    } else {
      req.flash('error', `DNS Entry ID: ${req.params.entryID} Not Found.`);
      res.redirect('/users/dns');
    }
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
    req.flash('success', `DNS Entry ${data.type} - ${data.name} Created.`);
    res.redirect('/users/dns');
  }).catch((err) => {
    return next(err);
  });
});

Router.post('/patch', (req, res, next) => {
  // Get and Patch is designated for security in mind. Make Sure the target item is alive.
  HTTP.GetJSON(`http://api-gate:3000/dns/${Sanitizer.sanitize(req.body.woot)}`).then((data) => {
    if (data !== {} && data.UserId === req.user) {
      return HTTP.PatchJSON(`http://api-gate:3000/dns/${data.id}`, {
        type: data.type,
        name: Sanitizer.sanitize(req.body.name),
        ipv4address: Sanitizer.sanitize(req.body.ip4),
        ipv6address: Sanitizer.sanitize(req.body.ip6),
        cname: Sanitizer.sanitize(req.body.opt)
      });
    } else {
      return {};
    }
  }).then((data) => {
    if (data !== {}) {
      req.flash('success', `DNS Entry ${data.type} - ${data.name} Updated.`);
    } else {
      req.flash('error', `DNS Entry ID: ${req.params.entryID} Not Found.`);
    }
    res.redirect('/users/dns');
  }).catch((err) => {
    return next(err);
  });
});

Router.get('/delete/:entryID((\\d+))', (req, res, next) => {
  HTTP.GetJSON(`http://api-gate:3000/dns/${req.params.entryID}`).then((data) => {
    if (data !== {} && data.UserId === req.user) {
      return HTTP.DeleteJSON(`http://api-gate:3000/dns/${data.id}`);
    } else if (data.UserId !== req.user) {
      return 403;
    } else {
      return 404;
    }
  }).then((data) => {
    switch (data) {
    case 403:
      req.flash('error', 'Action Not Authorized');
      break;
    case 404:
      req.flash('error', `DNS Entry ID: ${req.params.entryID} Not Found.`);
      break;
    default:
      req.flash('success', `DNS Entry ${data.type} - ${data.name} Updated.`);
    }
    res.redirect('/users/dns');
  }).catch((err) => {
    return next(err);
  });
});

module.exports = Router;
