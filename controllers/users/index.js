'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Passport  = require('passport');
const Auth      = require('../../helpers/authenticator');

/* GET users listing. */
Router.get('/', Auth.UserProtector, Auth.User.GetProfile, (req, res, next) => {
  res.render('user/index', {
    title: 'Operations Hub',
    breadcrumb: true
  });
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
  successRedirect: '/users',
  failureRedirect: '/users/login',
  failureFlash: true
}));

Router.get('/logout', Auth.Logout, (req, res, next) => {
  res.redirect('/');
});

Router.get('/profile', Auth.UserProtector, Auth.User.GetProfile, (req, res,next) => {
  res.render('user/profile', {
    breadcrumb: true,
    csrfToken: req.csrfToken(),
    title: 'Change Password',
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
});

Router.post('/profile', Auth.UserProtector, Auth.User.UpdatePassword, (req, res, next) => {
  res.redirect('/user/profile');
});

module.exports = Router;
