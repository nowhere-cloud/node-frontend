'use strict';

const DBConnection    = require('../models').sequelize;
const Passport        = require('passport');
const LocalStrategy   = require('passport-local').Strategy;
const Session         = require('express-session');
const SessionStore    = require('connect-session-sequelize')(Session.Store);
const Sanitizer       = require('sanitizer');
const env             = process.env.NODE_ENV || 'development';
const HTTP            = require('./promise-http');

/**
 * Hashed Password for development mode
 * @type {String}
 */
const secret = 'secret';

/**
 * Forbidden Usernames
 * @return {Array} Array of forbidden usernames
 */
const ForbiddenUserName = () => {
  return ['admin', 'root', 'administrator', 'master'];
};

/**
 * Passport Strategy
 */
const User_Strategy = new LocalStrategy((username, password, callback) => {
  if (env !== 'development') {
    HTTP.PostJSON('http://api:3000/user/validate', {
      username: username,
      password: password
    }).then((rsvp) => {
      // Correct user will receive 200 + Userdata
      return callback(null, rsvp);
    }).catch(() => {
      // Invalid User will receive code 403
      return callback(null, false, {
        message: 'Authentication Failed'
      });
    });
  } else {
    if (username !== 'foo' || password !== secret) {
      return callback(null, false, {
        message: 'Please check the development documentation for credentials.'
      });
    } else {
      return callback(null, {
        id: 2,
        username: 'foo'
      });
    }
  }

});

/**
 * Passport Strategy
 */
const Admin_Strategy = new LocalStrategy((username, password, callback) => {
  if (env !== 'development') {
    HTTP.PostJSON('http://auth:3000/validate', { password: password }).then((rsvp) => {
      // In Database, Administrator ID is 1 with dummy credentials
      return callback(null, {id: 1});
    }).catch(() => {
      // On Failed Authentication, bad HTTP codes is returned
      return callback(null, false, {
        message: 'Authentication Failed'
      });
    });
  } else {
    // Offline Development mode Authentication.
    if (password !== secret) {
      return callback(null, false, {
        message: 'Please check the development documentation for credentials.'
      });
    } else {
      return callback(null, {id: 1});
    }
  }
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
    HTTP.GetJSON(`http://api:3000/user/byid/${uid}`).then((user) => {
      if (user.hasOwnProperty('password'))
        delete user.password;
      cb(null, user);
    }).catch((e) => {
      cb(e);
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
  return next();
};

/**
 * Create User
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const Admin_CreateUser = (req, res, next) => {
  HTTP.GetJSON(`http://api:3000/user/byusername/${Sanitizer.sanitize(res.locals.username)}`).then((user) => {
    if (user !== null) {
      req.flash('eor', `User: ${req.body.username} already occupied.`);
      return next();
    } else {
      return HTTP.PostJSON('http://api:3000/user/', {
        username: Sanitizer.sanitize(req.body.username),
        password: Sanitizer.sanitize(req.body.password)
      });
    }
  }).then((user) => {
    req.flash('success', `User: ${user.username} (UID: ${user.id}) created.`);
    return next();
  }).catch((e) => {
    return next(e);
  });
};

/**
 * Delete Specified User
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const Admin_DeleteUser = (req, res, next) => {
  HTTP.DeleteJSON(`http://api:3000/user/byid/${res.locals.userid}`).then(() => {
    req.flash('success', `UID: ${res.locals.userid} deleted.`);
    return next();
  }).catch((e) => {
    return next(e);
  });
};

/**
 * Find User by ID, from requested
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const Admin_GetAllUser = (req, res, next) => {
  HTTP.GetJSON('http://api:3000/user/').then((users) => {
    res.locals.data = users;
    next();
  }).catch((e) => {
    return next(e);
  });
};

/**
 * Find User by ID, from requested
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const Admin_GetUserProfile = (req, res, next) => {
  HTTP.GetJSON(`http://api:3000/user/byid/${Sanitizer.sanitize(res.locals.userid)}`).then((user) => {
    if (user.hasOwnProperty('password'))
      delete user.password;
    res.locals.userdata = user;
    return next();
  }).catch((e) => {
    return next(e);
  });
};

/**
 * Find User by Username
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const Admin_FindUserByUsername = (req, res, next) => {
  HTTP.GetJSON(`http://api:3000/user/byusername/${Sanitizer.sanitize(res.locals.username)}`).then((user) => {
    if (user.hasOwnProperty('password'))
      delete user.password;
    res.locals.userdata = user;
    return next();
  }).catch((e) => {
    return next(e);
  });
};

/**
 * Update Password, for Users
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const User_UpdatePassword = (req, res, next) => {
  HTTP.PatchJSON(`http://api:3000/user/byid/${req.user.id}`, {
    password: Sanitizer.sanitize(req.body.password)
  }).then(() => {
    req.flash('success', 'Password Updated.');
    return next();
  }).catch((e) => {
    return next(e);
  });
};

/**
 * Update Password, for admin form
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const Admin_UpdateUserPassword = (req, res, next) => {
  HTTP.PatchJSON(`http://api:3000/user/byid/${Sanitizer.sanitize(req.body.woot)}`, {
    password: Sanitizer.sanitize(req.body.password)
  }).then(() => {
    req.flash('success', 'Password Updated.');
    return next();
  }).catch((e) => {
    return next(e);
  });
};

/**
 * Update Personal Password, for admin
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 */
const Admin_UpdateOwnPassword = (req, res, next) => {
  HTTP.PostJSON('http://auth:3000/', {
    password: Sanitizer.sanitize(req.body.password)
  }).then((rsvp) => {
    req.flash('success', 'Password Updated.');
    // In Database, Administrator ID is 1 with dummy credentials
    return next();
  }).catch((e) => {
    return next(e);
  });
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
    GetAllUser: Admin_GetAllUser,
    ForbiddenUserName: ForbiddenUserName
  },
  Session: {
    Store: Session_StoreInstance
  }
};
