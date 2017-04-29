'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');
const HTTP      = require('../../helpers/promise-http');

Router.all('*', Auth.User.Protection);

Router.get('/vm/:uuid', (req, res, next) => {
  HTTP.GetJSON(`http://api:3000/xen/vm/${req.params.uuid}`).then((data) => {
    res.json(data);
  }).catch((e) => {
    res.sendStatus(500);
  });
});

Router.get('/net/:uuid', (req, res, next) => {
  HTTP.GetJSON(`http://api:3000/xen/net/${req.params.uuid}`).then((data) => {
    res.json(data);
  }).catch((e) => {
    res.sendStatus(500);
  });
});

Router.get('/vif/:uuid', (req, res, next) => {
  HTTP.GetJSON(`http://api:3000/xen/vif/${req.params.uuid}`).then((data) => {
    res.json(data);
  }).catch((e) => {
    res.sendStatus(500);
  });
});

module.exports = Router;