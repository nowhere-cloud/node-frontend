'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');
const HTTP      = require('../../helpers/promise-http');

Router.all('*', Auth.Admin.Protection);

Router.get('/', (req, res, next) => {
  res.render('admin/instances', {
    title: 'Virtual Machines',
    breadcrumb: true
  });
});

Router.get('/partials/vm-list-hyp', (req, res, next) => {
  HTTP.GetJSON('http://api:3000/xen/vm/').then((data) => {
    res.render('_partials/vm-partials/vm-list', {
      mode: 'raw',
      data: data
    });
  }).catch((e) => {
    return next(e);
  });
});

Router.get('/partials/vm-tpl-hyp', (req, res, next) => {
  HTTP.GetJSON('http://api:3000/xen/vm/templates').then((data) => {
    res.render('_partials/vm-partials/tpl-list', {
      mode: 'raw',
      data: data
    });
  }).catch((e) => {
    return next(e);
  });
});

Router.get('/partials/net-list-hyp', (req, res, next) => {
  HTTP.GetJSON('http://api:3000/xen/net/').then((data) => {
    res.render('_partials/vm-partials/net-list', {
      data: data
    });
  }).catch((e) => {
    return next(e);
  });
});

Router.get('/partials/vif-list-hyp', (req, res, next) => {
  HTTP.GetJSON('http://api:3000/xen/vif/').then((data) => {
    res.render('_partials/vm-partials/vif-list', {
      data: data
    });
  }).catch((e) => {
    return next(e);
  });
});

Router.get('/:type/:uuid', (req, res, next) => {
  // Whitelisting
  const allowed = ['vm', 'vm-templates', 'net', 'vif'];
  if (allowed.indexOf(req.params.type) === -1 ) {
    // Kick to 404 Handler
    return next();
  } else {
    // Build Dynamic Request to reduce code dupe :p
    HTTP.GetJSON(`http://api:3000/xen/${req.params.type.split('-').join('/')}/${req.params.uuid}`).then((data) => {
      res.render('admin/instances-objDetail-skeleton', {
        title: `Object "${req.params.uuid}" Details`,
        mode: 'admin', // To Integrate User View into same tpls
        type: req.params.type, // Dynamic Include
        data: data
      });
    }).catch((e) => {
      return next(e);
    });
  }
});

Router.use('/api', require('./instances-api'));

module.exports = Router;
