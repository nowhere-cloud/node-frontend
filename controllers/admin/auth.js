'use strict';

const Express = require('express');
const Router  = Express.Router();
const Auth    = require('../../helpers/authenticator');

Router.get('/', (req, res, next) => {
  res.redirect('/');
});

Router.route('/login')
  .get((req, res, next) => {
    res.render('admin/login', {
      breadcrumb: true,
      csrfToken: req.csrfToken(),
      title: 'Login',
      errorMessage: req.flash('error'),
      successMessage: req.flash('success'),
      hideNavLoginButton: true
    });
  })
  .post(Auth.Passport.authenticate('local-admin', {
    failureRedirect: '/admin/auth/login',
    failureFlash: true
  }), (req, res, next) => {
    res.redirect('/admin');
  });

Router.get('/logout', Auth.Env.Logout, (req, res, next) => {
  res.redirect('/');
});

module.exports = Router;
