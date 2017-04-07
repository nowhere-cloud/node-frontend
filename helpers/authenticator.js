'use strict';

/**
 * Derivated from a Creative Commons Zero (CC0) Licensed,
 * General Assembly WEB DEVELOPMENT IMMERSIVE Lesson Material
 * https://github.com/ga-wdi-lessons/express-passport-sequelize
 *
 * The Code derivated from the above repo are publicized in Public Domain.
 * The main derivations are:
 * 1. using Native Crypto Library (selectively based on System Environment) instead of BCrypt.
 * 2. Extracted into a seperate file and called as CommonJS Module.
 * 3. ES6 Optimized.
 */

const DBConnection  = require('../models').sequelize;
const User          = require('../models').User;
const Passport      = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const debug         = require('debug')('authenticator');
const Session       = require('express-session');
const SessionStore  = require('connect-session-sequelize')(Session.Store);
const Sanitizer     = require('sanitizer');
let SHA256;
let Native = true;

// Fall Back to plain-ol-JavaScript Crypto if Native Crypto is not available
/* eslint-disable global-require */
try {
  SHA256 = require('crypto').createHash('sha256');
} catch (err) {
  debug(err);
  SHA256 = require('crypto-js/sha256');
  Native = false;
}
/* eslint-enable global-require */

/**
 * Calculate SHA256 of a specified String
 * @param {String} source Clear text
 * @return {String}       Ciphertext
 */
const GenerateSHA256 = (source) => {
  let cleanString = Sanitizer.sanitize(source);
  return Native ? SHA256.update(Buffer.from(cleanString)).digest('hex') : SHA256(cleanString).toString();
};

/**
 * Passport Strategy
 */
const Strategy = new LocalStrategy((username, password, callback) => {
  User.findOne({
    where: {
      username: username
    }
  }).then((user) => {
    if (!user) {
      return callback(null, false);
    }
    if (GenerateSHA256(password) !== user.password) {
      return callback(null, false);
    }
    return callback(null, user);
  }).catch((err) => {
    return callback(err);
  });
});

/**
 * Passport Serialize
 * @param {*} user User Object
 * @param {*} cb   Callback
 */
const Serialize = (user, cb) => {
  cb(null, user.id);
};

/**
 * Passport deserialize
 * @param {*} uid User ID
 * @param {*} cb  Callback
 */
const deSerialize = (uid, cb) => {
  User.findById(uid).then(function (user) {
    cb(null, user);
  }).catch((err) => {
    cb(err);
  });
};

/**
 * Check if the specified user is authenticated
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 * @return {Null}
 */
const EnsureUserIsLoggedIn = (req, res, next) => {
  if (req.user) {
    return next();
  } else {
    res.redirect('/users/login');
  }
};

/**
 * Expose User Instance for controlling menus.
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const SetGlobalUserInstance = (req, res, next) => {
  if (req.user) {
    res.locals.user = req.user;
  }
  next();
};

/**
 * Express.js SQL-Based Session Storage
 */
const StoreInstance = new SessionStore({
  db: DBConnection,
  checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds. (15 min)
  expiration: 24 * 60 * 60 * 1000 // The maximum age (in milliseconds) of a valid session. (24 hrs)
});

module.exports = {
  Connection: DBConnection,
  Strategy: Strategy,
  Serialize: Serialize,
  deSerialize: deSerialize,
  UserProtector: EnsureUserIsLoggedIn,
  GlobalUser: SetGlobalUserInstance,
  Passport: Passport,
  SessionStore: StoreInstance,
  SHA256: GenerateSHA256
};
