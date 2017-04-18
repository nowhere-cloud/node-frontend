'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');

Router.all('*', Auth.Admin.Protection);

Router.route('/')
  .get((req, res,next) => {
    res.render('admin/profile', {
      breadcrumb: true,
      csrfToken: req.csrfToken(),
      title: 'Change Password',
      errorMessage: req.flash('error'),
      successMessage: req.flash('success')
    });
  })
  .post(Auth.Admin.UpdateOwnPassword, (req, res, next) => {
    res.redirect('/admin/profile');
  });

module.exports = Router;
