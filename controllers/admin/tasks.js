'use strict';

const Express = require('express');
const Router  = Express.Router();
const Auth    = require('../../helpers/authenticator');
const Proxy   = require('express-http-proxy');

Router.all('*', Auth.Admin.Protection);

Router.get('/', (req, res, next) => {
  res.render('admin/tasks', {
    title: 'Tasks',
    breadcrumb: true
  });
});

// Fetch data directly from task endpoint on API Server.
// For Supporting Streamed data. Data will be handled
// using client side script instead of server-side render.
// This is a bit differ than others
Router.get('/api', Proxy('http://api:3000/', {
  forwardPath: (req, res) => {
    return '/task/';
  },
  limit: '5mb',
  timeout: 30*1000
}));

module.exports = Router;
