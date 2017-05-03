'use strict';

const Express         = require('express');
const Path            = require('path');
const Logger          = require('morgan');
const cookieParser    = require('cookie-parser');
const bodyParser      = require('body-parser');
const CSRF            = require('csurf');
const Auth            = require('./helpers/authenticator');
const Session         = require('express-session');
const Flash           = require('connect-flash');
const containerized   = require('containerized');

/* Express Core */
const app = Express();

/**
 * Prevent the application running in container as development mode
 * for security due to devlopment code are fused in for simplicity
 */
if(containerized() && app.get('env') === 'development') {
  throw new Error('Crictical Error: YOU ARE NOT ALLOWED TO RUN ME IN DEVELOPMENT MODE !!!');
}

/**
 * Get session key from environment variables
 * Error if Such Key Not Found. Important for Session Security
 * Generate a random key on development environment.
 */
if (!process.env.SESS_KEY && app.get('env') !== 'development') {
  throw new Error('Crictical Error: No Crypt Words Defined. This word is important for maintain user security');
}
const secret_key = app.get('env') === 'development' ? Math.random().toString(36) : process.env.SESS_KEY;

/* Load Various Supporting Middleware */

app.set('views', Path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(Express.static(Path.join(__dirname, 'public')));

// Post Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Cookie Parser
app.use(cookieParser(secret_key));

// API Tunnel for test.
// TODO: Remove before deployment.
app.use('/api', require('./controllers/api')); // eslint-disable-line global-require

/* Session */

// 1. Build Session Table
Auth.Session.Store.sync();

// 2. Configure Session Storage
app.use(Session({
  secret: secret_key,
  store: Auth.Session.Store,
  proxy: true,
  resave: false,
  saveUninitialized: true
}));

// Apache-Style logger, although it is useless because we dont have terminal?
app.use(Logger('common'));

// CSRF (Cross Site Request Forgery)
app.use(CSRF());
// Flash Messages (Login Fail, or what!?)
app.use(Flash());

// Create Authenticator
Auth.Passport.use('local-user', Auth.User.Strategy);

// Create Admin Site Protection
Auth.Passport.use('local-admin', Auth.Admin.Strategy);

// Connect Authenticator to User Model
Auth.Passport.serializeUser(Auth.Serialize);
Auth.Passport.deserializeUser(Auth.DeSerialize);

// Attach Authenticator
app.use(Auth.Passport.initialize());
app.use(Auth.Passport.session());

// Expose User Instance
app.use(Auth.Env.GlobalUser);

/* Load Controllers. */

app.use('/', require('./controllers'));

/* Error Handlers */

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).render('error', {
    title: 'Error'
  });
});

module.exports = app;
