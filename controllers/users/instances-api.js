'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');
const HTTP      = require('../../helpers/promise-http');

Router.all('*', Auth.User.Protection);

Router.get('/vm/:uuid/metrics', (req, res, next) => {
  HTTP.GetJSON(`http://api:3000/xen/vm/${req.params.uuid}/metrics`).then((data) => {
    res.json(data);
  }).catch((e) => {
    res.send(e);
  });
});

Router.get('/vm/:uuid/pstate', (req, res, next) => {
  HTTP.GetJSON(`http://api:3000/xen/vm/${req.params.uuid}`).then((data) => {
    // Reproduce a reduced data
    if (data.Status === 'Success') {
      res.json({
        Status: data.Status,
        Value: {
          allowed_operations: data.Value.allowed_operations,
          power_state: data.Value.power_state
        }
      });
    } else {
      res.json(data);
    }
  }).catch((e) => {
    res.send(e);
  });
});

Router.post('/vm/:uuid/send', (req, res, next) => {
  let action = req.body.action.split('.');
  let action_verb = action[action.length - 1]; // Last item
  HTTP.PostJSON(`http://api:3000/xen/vm/${req.params.uuid}/${action_verb}`, {
    userid: req.user.id,
    payload: req.body.payload
  }).then((data) => {
    res.json(data);
  }).catch((e) => {
    res.send(e);
  });
});

/*
 * Temporally Shield the API for handling Tagging
 *
Router.post('/vm/:uuid/tag', (req, res, next) => {
  HTTP.PostJSON(`http://api:3000/xen/vm/${req.params.uuid}/tag`, {
    userid: req.user.id,
    payload: req.body.payload
  }).then((data) => {
    res.json(data);
  }).catch((e) => {
    res.sendStatus(500);
  });
});

Router.post('/vm/:uuid/untag', (req, res, next) => {
  HTTP.PostJSON(`http://api:3000/xen/vm/${req.params.uuid}/tag/rm`, {
    userid: req.user.id,
    payload: req.body.payload
  }).then((data) => {
    res.json(data);
  }).catch((e) => {
    res.sendStatus(500);
  });
});
*/

Router.get('/tasks', (req, res, next) => {
  HTTP.GetJSON(`http://api:3000/task/byuid/${req.user.id}`).then((data) => {
    res.json(data);
  }).catch((e) => {
    res.sendStatus(500);
  });
});

module.exports = Router;
