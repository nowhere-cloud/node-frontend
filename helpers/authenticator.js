'use strict';

// Based On an Open Source Implementation Cookbook
// https://github.com/super-secret/passport-sequelize

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
 * Passport Strategy
 */
const Strategy = new LocalStrategy((username, password, cb) => {
  let cleanedPassword = Sanitizer.sanitize(password);
  let hashedPassword  = Native ? SHA256.update(Buffer.from(cleanedPassword)).digest('hex') : SHA256(cleanedPassword).toString();
  User.findOne({
    where: {
      username: username
    }
  }).then((user) => {
    if (!user) {
      return cb(null, false);
    }
    if (hashedPassword !== user.password) {
      return cb(null, false);
    }
    return cb(null, user);
  }).catch((err) => {
    return cb(err);
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
  if(req.user){
    res.locals.currentUser = req.user.username;
    return next();
  } else {
    res.redirect('/users/login');
  }
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
  Passport: Passport,
  Session: Session,
  SessionStore: StoreInstance
};
