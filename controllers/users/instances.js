'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');
const HTTP      = require('../../helpers/promise-http');

Router.all('*', Auth.User.Protection);

Router.get('/', (req, res, next) => {
  res.render('admin/instances', {
    title: 'Virtual Machines',
    breadcrumb: true,
    errorMessage: req.flash('error'),
    successMessage: req.flash('success')
  });
});

Router.get('/partials/vm-list-hyp', (req, res, next) => {
  HTTP.GetJSON(`http://api:3000/xen/vm/byuser/${req.user.id}`).then((data) => {
    res.render('_partials/vm-partials/vm-list', {
      data: data
    });
  }).catch((e) => {
    return next(e);
  });
});

Router.get('/partials/vm-tpl-reg', (req, res, next) => {
  HTTP.GetJSON('http://api:3000/xen/vm//templates/bytag/templates-publicise').then((data) => {
    res.render('_partials/vm-partials/tpl-list', {
      mode: 'raw',
      data: data
    });
  }).catch((e) => {
    return next(e);
  });
});

Router.get('/partials/net-list-hyp', (req, res, next) => {
  HTTP.GetJSON(`http://api:3000/xen/net/byuser/${req.user.id}`).then((data) => {
    res.render('_partials/vm-partials/net-list', {
      data: data
    });
  }).catch((e) => {
    return next(e);
  });
});

Router.route('/vm/provision')
  .get((req, res, next) => {
    HTTP.GetJSON(`http://api:3000/xen/vm/templates/${req.query.t}`).then((data) => {
      res.render('user/instances-provision', {
        title: 'Provision a New VM Instance',
        uuid: req.query.t,
        data: data,
        csrf: req.csrfToken()
      });
    }).catch((e) => {
      return next(e);
    });
  })
  .post((req, res, next) => {
    HTTP.PostJSON('http://api:3000/xen/vm/create', {
      userid: req.user.id,
      payload: {
        userid: req.user.id,
        src: req.body.uuid,
        vm_name: req.body.vm_name,
        ks: req.body.kickstart, // Link to Answer File
        repo: req.body.repo,
        distro: req.body.distro,
        debian_distro: req.body.debian_distro,
        network: req.body.network,
        disk_size: req.body.disk_size,
        disk_unit: req.body.disk_unit,
        ram_size: req.body.ram_size,
        ram_unit: req.body.ram_unit
      }
    }).then((key) => {
      req.flash('success', `Job Received. Task ID: ${key.task}`);
      res.redirect('/users/instances');
    }).catch((e) => {
      return next(e);
    });
  });

Router.route('/vm/clone')
  .get((req, res, next) => {
    HTTP.GetJSON(`http://api:3000/xen/vm/${req.query.t}`).then((data) => {
      res.render('user/instances-clone', {
        title: 'Clone an VM Instance',
        uuid: req.query.t,
        data: data,
        csrf: req.csrfToken()
      });
    }).catch((e) => {
      return next(e);
    });
  })
  .post((req, res, next) => {
    HTTP.PostJSON(`http://api:3000/xen/vm/${req.body.uuid}/clone`, {
      userid: req.user.id,
      payload: {
        userid: req.user.id,
        vm_name: req.body.vm_name
      }
    }).then((key) => {
      req.flash('success', `Job Received. Task ID: ${key.task}`);
      res.redirect('/users/instances');
    }).catch((e) => {
      return next(e);
    });
  });

Router.get('/:type/:uuid', (req, res, next) => {
  // Whitelisting
  const allowed = ['vm', 'net', 'vm-templates', 'vif'];
  if (allowed.indexOf(req.params.type) === -1 ) {
    // Kick to 404 Handler
    return next();
  } else {
    // Build Dynamic Request to reduce code dupe :p
    HTTP.GetJSON(`http://api:3000/xen/${req.params.type.split('-').join('/')}/${req.params.uuid}`).then((data) => {
      res.render('user/instances-objDetail-skeleton', {
        title: 'Object Details',
        mode: 'user', // To Integrate User View into same tpls
        type: req.params.type, // Dynamic Include,
        breadcrumb: true,
        data: data,
        uuid: req.params.uuid
      });
    }).catch((e) => {
      return next(e);
    });
  }
});

Router.use('/api', require('./instances-api'));

module.exports = Router;
