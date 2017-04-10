'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');

Router.get('/', Auth.UserProtector, Auth.User.GetProfile, (req, res,next) => {
  res.render('user/profile', {
    breadcrumb: true,
    csrfToken: req.csrfToken(),
    title: 'Change Password',
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
});

Router.post('/', Auth.UserProtector, Auth.User.UpdatePassword, (req, res, next) => {
  res.redirect('/user/');
});

module.exports = Router;
