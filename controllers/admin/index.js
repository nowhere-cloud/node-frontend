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

Router.use('/instances', require('./instances'));

Router.use('/auth', require('./auth'));

Router.use('/log', require('./log'));

Router.use('/profile', require('./profile'));

Router.use('/assets', require('./assets'));

Router.use('/users', require('./user'));

Router.use('/tasks', require('./tasks'));

module.exports = Router;
