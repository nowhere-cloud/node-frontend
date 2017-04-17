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
const DBConnection    = require('../models').sequelize;
const User            = require('../models').User;
const Passport        = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
const debug           = require('debug')('authenticator');
const Session         = require('express-session');
const SessionStore    = require('connect-session-sequelize')(Session.Store);
const Sanitizer       = require('sanitizer');
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
const User_Strategy = new LocalStrategy((username, password, callback) => {
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
 * Passport Strategy
 */
const Admin_Strategy = new LocalStrategy((username, password, callback) => {
  let mash = global.mash_key;
  let admn = global.admn_key;
  if (SHA256(`${mash}${SHA256(password)}${mash}`) !== admn) {
    return callback(null, false);
  }
  return callback(null, {
    id: 0,
    username: 'Administrator',
    password: 'youwontseemeinthewildasthiswouldbediscardedduringserialization',
    admin: true
  });
});


/**
 * Passport Serialize
 * @param {*} user User Object
 * @param {*} cb   Callback
 */
const Serialize = (user, cb) => {
  delete user.password;
  cb(null, user);
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
 * Private Zone Protection
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 * @return {Null}
 */
const EnsureUserIsLoggedIn = (req, res, next) => {
  if (req.user || req.app.get('env') === 'development') {
    return next();
  }
  res.redirect('/users/auth/login');
};

/**
 * Expose User Instance for controlling menus.
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const SetGlobalUserInstance = (req, res, next) => {
  if (req.user || req.app.get('env') === 'development') {
    res.locals.userdata = req.user;
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

/**
 * Logout Action.
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const Logout = (req, res, next) => {
  req.logout();
  next();
};

/**
 * Create User
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const CreateUser = (req, res, next) => {
  User.findOne({
    username: Sanitizer.sanitize(req.body.username)
  }).then((user) => {
    if (user) {
      req.flash('error', `User: ${req.body.username} already occupied.`);
      return next();
    } else {
      User.create({
        username: Sanitizer.sanitize(req.body.username),
        password: GenerateSHA256(req.body.password)
      }).then(function (user) {
        req.flash('success', `User: ${req.body.username} created.`);
        return next();
      }).catch((err) => {
        return next(err);
      });
    }
  }).catch((err) => {
    return next(err);
  });
};

/**
 * Delete Specified User
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const DeleteUser = (req, res, next) => {
  User.findOne({
    username: Sanitizer.sanitize(req.body.username)
  }).then((user) => {
    return user.destroy();
  }).then(() => {
    req.flash('success', `User: ${req.body.username} deleted.`);
    return next();
  }).catch((err) => {
    return next(err);
  });
};

/**
 * Find User by ID, from requested
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const Admin_GetUserProfile = (req, res, next) => {
  User.findById(
    Sanitizer.sanitize(req.body.userid)
  ).then((user) => {
    delete user.password;
    res.locals.userdata = user;
    next();
  }).catch((err) => {
    return next(err);
  });
};

/**
 * Find User by Username
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const FindUserByUsername = (req, res, next) => {
  User.findOne({
    username: Sanitizer.sanitize(req.body.username)
  }).then((user) => {
    delete user.password;
    res.locals.userdata = user;
    next();
  }).catch((err) => {
    return next(err);
  });
};

/**
 * Update Password, for Users
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const User_UpdatePassword = (req, res, next) => {
  User.findById(req.user.id).then((user) => {
    return user.update({
      password: GenerateSHA256(req.body.password)
    });
  }).then(() => {
    req.flash('success', 'Password Updated.');
    return next();
  }).catch((err) => {
    return next(err);
  });
};

/**
 * Update Password, for admin form
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const Admin_UpdateUserPassword = (req, res, next) => {
  User.findById(Sanitizer.sanitize(req.body.userid)).then((user) => {
    return user.update({
      password: GenerateSHA256(req.body.password)
    });
  }).then(() => {
    req.flash('success', 'Password Updated.');
    return next();
  }).catch((err) => {
    return next(err);
  });
};

/**
 * Update Personal Password, for admin
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const Admin_UpdateOwnPassword = (req, res, next) => {
  const mash = global.mash_key;
  const pass = SHA256(Sanitizer.sanitize(req.body.password));
  global.admn_key = SHA256(`${mash}${pass}${mash}`);
  req.flash('success', 'Password Updated.');
  return next();
};

/**
 * Admin Zone Protection
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 * @return {Null}
 */
const AdminProtection = (req, res, next) => {
  if (req.user.admin || req.app.get('env') === 'development') {
    return next();
  }
  res.redirect('/users/auth/login');
};


module.exports = {
  Connection: DBConnection,
  Serialize: Serialize,
  deSerialize: deSerialize,
  UserProtector: EnsureUserIsLoggedIn,
  GlobalUser: SetGlobalUserInstance,
  Passport: Passport,
  SHA256: GenerateSHA256,
  Logout: Logout,
  User: {
    Strategy: User_Strategy,
    UpdatePassword: User_UpdatePassword
  },
  Admin: {
    NewUser: CreateUser,
    DeleteUser: DeleteUser,
    FindUserById: Admin_GetUserProfile,
    FindUserByUsername: FindUserByUsername,
    UpdateUserPassword: Admin_UpdateUserPassword,
    UpdateOwnPassword: Admin_UpdateOwnPassword,
    Protection: AdminProtection
  },
  SessionStore: StoreInstance
};
