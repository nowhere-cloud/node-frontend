'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Passport  = require('passport');
const Helper    = require('../../helpers');

/* GET users listing. */
Router.get('/', Helper.ensureAuthenticated, (req, res, next) => {
  res.send('respond with a resource');
});

Router.get('/login', (req, res, next) => {
  res.render('user/login', {
    breadcrumb: true,
    csrfToken: req.csrfToken(),
    title: 'Login'
  });
});

Router.post('/login', Passport.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/users/login',
  failureFlash: true
}));

module.exports = Router;
