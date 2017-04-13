'use strict';

const Express   = require('express');
const Router    = Express.Router();
const Auth      = require('../../helpers/authenticator');
const Path      = require('path');

Router.all('*', Auth.UserProtector);

// Protected Assets
Router.get('/:filename', (req, res, next) => {
  let options = {
    root: Path.join(__dirname, '../../private/assets'),
    dotfiles: 'deny'
  };
  res.sendFile(req.params.filename, options, (err => {
    if (err) return next(err);
  }));
});

module.exports = Router;
