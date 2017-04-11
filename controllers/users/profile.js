'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');

Router.all('*', Auth.UserProtector);

Router.route('/')
  .get(Auth.User.GetProfile, (req, res,next) => {
    res.render('user/profile', {
      breadcrumb: true,
      csrfToken: req.csrfToken(),
      title: 'Change Password',
      errorMessage: req.flash('error'),
      successMessage: req.flash('success')
    });
  })
  .post(Auth.User.UpdatePassword, (req, res, next) => {
    res.redirect('/user/');
  });

module.exports = Router;
