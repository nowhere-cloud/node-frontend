
'use strict';

const express       = require('express');
const path          = require('path');
const logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const passport      = require('passport');
const session       = require('express-session');
const crypto        = require('crypto');
const model         = require('./models');
const SessionStore  = require('connect-session-sequelize')(session.Store);

// Generate Cookie Key, or get key from environment variables
const secret_key = process.env.SESS_KEY || crypto.randomBytes(20).toString('hex');

// Session Store Instance
const StoreInstance = new SessionStore({
  db: model.sequelize,
  checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds. (15 min)
  expiration: 24 * 60 * 60 * 1000          // The maximum age (in milliseconds) of a valid session. (24 hrs)
});

/**
 * Express Core`
 */
const app = express();

/* Load Various Supporting Middleware */

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(require('stylus').middleware({
  src: path.join(__dirname, 'assets'),
  dest: path.join(__dirname, 'public'),
  compress: process.env.NODE_ENV === 'development' ? false : true
}));
app.use(express.static(path.join(__dirname, 'public')));
// Enable Pretty HTML, based on current environment value
// TODO: Cleanup when push to production stage
// app.locals.pretty = process.env.NODE_ENV === 'development' ? true : false;
app.locals.pretty = true;

// Post Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Apache-Style logger
app.use(logger('common'));

/* =========================================== */

/* Session & Authentication Stuffs */

app.use(cookieParser(secret_key)); // For non-authentication cookies

StoreInstance.sync(); // Auto Deploy Session Table
app.use(session({
  secret: secret_key,
  store: StoreInstance,
  proxy: true,
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

// Init Authenticator
passport.use(model.User.createStrategy());

/* =========================================== */

// Load All Controllers.
app.use('/', require('./controllers'));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  // TODO: Cleanup when push to production stage
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500).render('error', {
    title: 'Express'
  });
});

module.exports = app;
