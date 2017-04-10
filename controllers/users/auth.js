'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');

Router.get('/', (req, res, next) => {
  res.redirect('../');
});

Router.get('/login', (req, res, next) => {
  res.render('user/login', {
    breadcrumb: true,
    csrfToken: req.csrfToken(),
    title: 'Login',
    errorMessage: req.flash('error'),
    successMessage: req.flash('success'),
    hideNavLoginButton: true
  });
});

Router.post('/login', Auth.Passport.authenticate('local', {
  successRedirect: '../',
  failureRedirect: './',
  failureFlash: true
}));

Router.get('/logout', Auth.Logout, (req, res, next) => {
  res.redirect('/');
});

module.exports = Router;
