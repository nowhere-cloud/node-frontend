'use strict';

const Express = require('express');
const Router  = Express.Router();
const HTTP    = require('../../helpers/promise-http');
const User    = require('../../models').User;
const Auth    = require('../../helpers/authenticator');

Router.all('*', Auth.Admin.Protection);

Router.get('/', (req, res, next) => {
  res.render('admin/user', {
    title: 'User Management',
    breadcrumb: true,
    successMessage: req.flash('success'),
    errorMessage: req.flash('error')
  });
});

Router.get('/partials/user-list', (req, res, next) => {
  // UID 1 is the Admin user created with random data
  User.findAll({ where: { $not: [{ id: 1 }] } }).then((data) => {
    res.locals.data = data.forEach((v) => { delete v.password; });
    res.render('admin/_partials/userlist');
  });
});

module.exports = Router;
