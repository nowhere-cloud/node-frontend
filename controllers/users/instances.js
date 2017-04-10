'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');

Router.get('/', Auth.UserProtector, (req, res, next) => {
  res.render('user/instances', {
    title: 'Virtual Machine Instances',
    breadcrumb: true
  });
});

module.exports = Router;
