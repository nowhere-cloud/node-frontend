
'use strict';

const Express       = require('express');
const Path          = require('path');
const Logger        = require('morgan');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const CSRF          = require('csurf');
const Stylus        = require('stylus');
const Passport      = require('passport');
const Session       = require('express-session');
const Crypto        = require('crypto');
const Model         = require('./models');
const SessionStore  = require('connect-session-sequelize')(Session.Store);

// Generate Cookie Key, or get key from environment variables
const secret_key = process.env.SESS_KEY || Crypto.randomBytes(20).toString('hex');

// Session Store Instance
const StoreInstance = new SessionStore({
  db: Model.sequelize,
  checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds. (15 min)
  expiration: 24 * 60 * 60 * 1000          // The maximum age (in milliseconds) of a valid session. (24 hrs)
});

/**
 * Express Core`
 */
const app = Express();

/* Load Various Supporting Middleware */

app.set('views', Path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(Stylus.middleware({
  src: Path.join(__dirname, 'assets'),
  dest: Path.join(__dirname, 'public'),
  compress: process.env.NODE_ENV === 'development' ? false : true
}));
app.use(Express.static(Path.join(__dirname, 'public')));
app.locals.pretty = process.env.NODE_ENV === 'development' ? true : false;

// Post Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Apache-Style logger
app.use(Logger('common'));

/* =========================================== */

/* Session & Authentication Stuffs */

app.use(cookieParser(secret_key)); // For non-authentication cookies

StoreInstance.sync(); // Auto Deploy Session Table
app.use(Session({
  secret: secret_key,
  store: StoreInstance,
  proxy: true,
  resave: false,
  saveUninitialized: true
}));
app.use(Passport.initialize());
app.use(Passport.session());

// Init Authenticator
Passport.use(Model.User.createStrategy());

// CSRF (Cross Site Request Forgery)
app.use(CSRF());

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
