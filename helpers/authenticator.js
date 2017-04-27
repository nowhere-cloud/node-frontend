'use strict';

/**
 * Derivated from a Creative Commons Zero (CC0) Licensed,
 * General Assembly WEB DEVELOPMENT IMMERSIVE Lesson Material
 * https://github.com/ga-wdi-lessons/express-passport-sequelize
 *
 * The Code derivated from the above repo are publicized in Public Domain.
 * The main derivations are:
 * 1. using Native Crypto Library instead of BCrypt.
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
const env             = process.env.NODE_ENV || 'development';
const Crypto          = require('crypto');

/**
 * Calculate SHA256 of a specified String
 * @param {String} source Clear text
 * @return {String}       Cipher text
 */
const GenerateSHA256 = (source) => {
  let cleanString = Sanitizer.sanitize(source);
  return Crypto.createHash('sha256').update(cleanString).digest('hex');
};

/**
 * Hash Function of User Password
 * @param {String} raw Clear Text
 * @return {String} Encrypted Password
 */
const PasswordHashFunction = (raw) => {
  let reverse = raw.split('').reverse().join('');
  return GenerateSHA256(`${GenerateSHA256(reverse)}${GenerateSHA256(raw)}${reverse}`);
};

/**
 * Forbidden Usernames
 * @return {Array} Array of forbidden usernames
 */
const ForbiddenUserName = () => {
  return ['admin', 'root', 'administrator', 'master'];
};

/**
 * Hash Function of Admin Password
 * @param {String} raw Clear Text
 * @return {String} Encrypted Password
 */
const AltPasswordHashFunction = (raw) => {
  let mash = global.mash_key;
  return GenerateSHA256(`${mash}${GenerateSHA256(raw)}${mash}`);
};

/**
 * Passport Strategy
 */
const User_Strategy = new LocalStrategy((username, password, callback) => {
  if (env !== 'development') {
    User.findOne({ where: { username: username } }).then((user) => {
      if (!user || PasswordHashFunction(password) !== user.password) {
        return callback(null, false, {
          message: 'Authentication Failed.'
        });
      }
      return callback(null, user);
    }).catch((err) => {
      return callback(err);
    });
  } else {
    if (username !== 'foo' || PasswordHashFunction(password) !== 'd9a8b776378a511563ad5795158a8b65677d6d67e39bd37c0216602c3d604b8e') {
      return callback(null, false, {
        message: 'Please check the development documentation for credentials.'
      });
    } else {
      return callback(null, {
        id: 1,
        username: 'foo'
      });
    }
  }

});

/**
 * Passport Strategy
 */
const Admin_Strategy = new LocalStrategy((username, password, callback) => {
  let admn = global.admn_key;
  if (AltPasswordHashFunction(password) !== admn) {
    return callback(null, false, {
      message: 'Authentication Failed'
    });
  }
  // In Database, Administrator ID is 1 with dummy credentials
  return callback(null, {id: 1});
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
  if (uid === 1) {
    // Administrator
    return cb(null, {
      id: 1,
      username: 'Administrator',
      admin: true
    });
  } else if (env === 'development') {
    // User
    return cb(null, {
      id: 2,
      username: 'foo'
    });
  } else {
    User.findById(uid).then(function(user) {
      delete user.password;
      cb(null, user);
    }).catch((err) => {
      cb(err);
    });
  }
};

/**
 * Private Zone Protection
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 * @return {Null}
 */
const User_Protection = (req, res, next) => {
  if (req.user && req.user.hasOwnProperty('admin')) {
    res.redirect('/admin');
  }
  if (req.user) {
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
  if (req.user) {
    res.locals.userdata = req.user;
  }
  next();
};

/**
 * Express.js SQL-Based Session Storage
 */
const Session_StoreInstance = new SessionStore({
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
const Admin_CreateUser = (req, res, next) => {
  User.findOne({ where: {
    username: Sanitizer.sanitize(req.body.username)
  }}).then((user) => {
    if (user !== null) {
      req.flash('error', `User: ${req.body.username} already occupied.`);
      return next();
    } else {
      User.create({
        username: Sanitizer.sanitize(req.body.username),
        password: PasswordHashFunction(req.body.password)
      }).then(function(user) {
        req.flash('success', `User: ${user.username} (UID: ${user.id}) created.`);
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
const Admin_DeleteUser = (req, res, next) => {
  User.findById(Sanitizer.sanitize(req.params.userid)).then((user) => {
    return user.destroy();
  }).then(() => {
    req.flash('success', `UID: ${req.params.userid} deleted.`);
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
  User.findById(Sanitizer.sanitize(req.body.userid)).then((user) => {
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
const Admin_FindUserByUsername = (req, res, next) => {
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
      password: PasswordHashFunction(req.body.password)
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
  User.findById(Sanitizer.sanitize(req.body.woot)).then((user) => {
    return user.update({
      password: PasswordHashFunction(req.body.password)
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
  global.admn_key = AltPasswordHashFunction(Sanitizer.sanitize(req.body.password));
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
const Admin_Protection = (req, res, next) => {
  if (req.user && req.user.hasOwnProperty('admin')) {
    return next();
  }
  res.redirect('/');
};

module.exports = {
  Connection: DBConnection,
  Passport: Passport,
  Serialize: Serialize,
  DeSerialize: deSerialize,
  SHA256: GenerateSHA256,
  Env: {
    GlobalUser: SetGlobalUserInstance,
    Logout: Logout
  },
  User: {
    Strategy: User_Strategy,
    UpdatePassword: User_UpdatePassword,
    Protection: User_Protection
  },
  Admin: {
    Strategy: Admin_Strategy,
    NewUser: Admin_CreateUser,
    DeleteUser: Admin_DeleteUser,
    FindUserById: Admin_GetUserProfile,
    FindUserByUsername: Admin_FindUserByUsername,
    UpdateUserPassword: Admin_UpdateUserPassword,
    UpdateOwnPassword: Admin_UpdateOwnPassword,
    Protection: Admin_Protection,
    ForbiddenUserName: ForbiddenUserName
  },
  Session: {
    Store: Session_StoreInstance
  }
};
