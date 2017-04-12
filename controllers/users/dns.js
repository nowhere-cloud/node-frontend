'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');
const Path      = require('path');

Router.all('*', Auth.UserProtector);

Router.get('/', (req, res, next) => {
  res.render('user/dns', {
    title: 'DNS Configuration',
    breadcrumb: true
  });
});

Router.get('/partials/list', (req, res, next) => {
  // res.render('user/_partials/dns-table', {
  //   data: [{}]
  // });
  res.sendStatus(404);
});

// The Protected JavaScript
Router.get('/assets/:filename', (req, res, next) => {
  let options = {
    root: Path.join(__dirname, '../../private/assets/javascripts'),
    dotfiles: 'deny'
  };
  res.sendFile(req.params.filename, options, (err => {
    if (err) return next(err);
  }));
});

module.exports = Router;
