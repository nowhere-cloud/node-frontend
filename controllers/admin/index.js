'use strict';

const Express = require('express');
const Router  = Express.Router();
const Auth    = require('../../helpers/authenticator');

Router.get('/', Auth.Admin.Protection, (req, res, next) => {
  res.render('admin/index', {
    title: 'Operations Hub',
    breadcrumb: true
  });
});

Router.use('/dns', require('./dns'));

Router.use('/auth', require('./auth'));

Router.use('/log', require('./status'));

Router.use('/profile', require('./profile'));

Router.use('/assets', require('./assets'));

Router.use('/users', require('./user'));

module.exports = Router;
