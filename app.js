
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

// view engine + Static File setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(logger('common'));
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// Post Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
 * Session & Authentication Stuffs
 */
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

// Setup Routs here.
app.use('/', require('./controllers/index'));
app.use('/api', require('./controllers/api'));
app.use('/users', require('./controllers/users'));

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
  // res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500).render('error');
});

module.exports = app;
