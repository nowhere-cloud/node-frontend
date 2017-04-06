'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Passport  = require('passport');
const Auth      = require('../../helpers/authenticator');

/* GET users listing. */
Router.get('/', Auth.UserProtector, (req, res, next) => {
  res.send('respond with a resource');
});

Router.get('/login', (req, res, next) => {
  res.render('user/login', {
    breadcrumb: true,
    csrfToken: req.csrfToken(),
    title: 'Login',
    errorMessage: req.flash('error'),
    hideNavLoginButton: true
  });
});

Router.post('/login', Auth.Passport.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/users/login',
  failureFlash: true
}));

Router.get('/logout', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

module.exports = Router;
