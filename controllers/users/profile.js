'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');

Router.all('*', Auth.User.Protection);

Router.route('/')
  .get((req, res,next) => {
    res.render('user/profile', {
      breadcrumb: true,
      csrfToken: req.csrfToken(),
      title: 'Change Password',
      errorMessage: req.flash('error'),
      successMessage: req.flash('success')
    });
  })
  .post(Auth.User.UpdatePassword, (req, res, next) => {
    res.redirect('/users/profile');
  });

module.exports = Router;
