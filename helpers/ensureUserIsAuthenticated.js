'use strict';

// https://stackoverflow.com/questions/17756848/only-allow-passportjs-authenticated-users-to-visit-protected-page

/**
 * Check if the specified user is authenticated
 * @param  {Object}   req  Express//Connect Request
 * @param  {Object}   res  Express//Connect Response
 * @param  {Function} next Call next middleware
 * @return {Null}
 */
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
};

module.exports = isAuthenticated;
