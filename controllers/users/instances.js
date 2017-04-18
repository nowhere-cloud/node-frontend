'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');

Router.all('*', Auth.User.Protection);

Router.get('/', (req, res, next) => {
  res.render('user/instances', {
    title: 'Virtual Machines',
    breadcrumb: true
  });
});

module.exports = Router;
