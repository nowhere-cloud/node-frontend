'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');

/* GET users listing. */
Router.get('/', Auth.User.Protection, (req, res, next) => {
  res.render('user/index', {
    title: 'Operations Hub',
    breadcrumb: true
  });
});

Router.use('/auth', require('./auth'));

Router.use('/profile', require('./profile'));

Router.use('/dns', require('./dns'));

Router.use('/instances', require('./instances'));

Router.use('/assets', require('./assets'));

module.exports = Router;
