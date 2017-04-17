'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');

Router.all('*', Auth.Admin.Protector);

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
    res.redirect('/user/');
  });

module.exports = Router;
