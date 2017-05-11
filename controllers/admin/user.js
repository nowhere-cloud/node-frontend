'use strict';

const Express   = require('express');
const Router    = Express.Router();
const HTTP      = require('../../helpers/promise-http');
const Auth      = require('../../helpers/authenticator');
const Sanitizer = require('sanitizer');

Router.all('*', Auth.Admin.Protection);

Router.route('/')
  .get((req, res, next) => {
    res.render('admin/user', {
      title: 'User Management',
      breadcrumb: true,
      successMessage: req.flash('success'),
      errorMessage: req.flash('error'),
      csrfToken: req.csrfToken()
    });
  })
  .post((req, res, next) => {
    Auth.Admin.ForbiddenUserName().forEach((val, idx, self) => {
      if (req.body.username.includes(val)) {
        req.flash('error', `Error: Username ${req.body.username} disallowed.`);
        res.redirect('/admin/users');
        return false;
      }
    });
    res.locals.username = req.body.username;
    return next();
  }, Auth.Admin.NewUser, (req, res, next) => {
    res.redirect('/admin/users');
  });

Router.get('/partials/user-list', Auth.Admin.GetAllUser, (req, res, next) => {
  res.render('admin/_partials/user-list', {
    data: res.locals.data
  });
});

Router.get('/partials/user-form/:userid', (req, res, next) => {
  // UID 1 is the Admin user created with random data
  if (req.params.userid === '1') {
    res.sendStatus(500);
  } else {
    res.locals.userid = req.params.userid;
    return next();
  }
}, Auth.Admin.FindUserById, (req, res, next) => {
  res.render('admin/_partials/user-edit-form', {
    csrf: req.csrfToken(),
    data: res.locals.userdata
  });
});

Router.post('/patch', Auth.Admin.UpdateUserPassword, (req, res, next) => {
  res.redirect('/admin/users');
});

Router.get('/delete/:userid', (req, res, next) => {
  if (req.params.userid === '1') {
    res.flash('error', 'Error: Action Denied.');
    res.redirect('/admin/users');
  } else {
    res.locals.userid = req.params.userid;
    return next();
  }
}, Auth.Admin.DeleteUser, (req, res, next) => {
  res.redirect('/admin/users');
});

Router.get('/report', Auth.Admin.GetAllUser, (req, res, next) => {
  res.render('admin/report-user', {
    title: 'User Audit',
    data: res.locals.data
  });
});


module.exports = Router;
