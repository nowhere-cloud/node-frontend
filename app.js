'use strict';

const Express         = require('express');
const Path            = require('path');
const Logger          = require('morgan');
const cookieParser    = require('cookie-parser');
const bodyParser      = require('body-parser');
const CSRF            = require('csurf');
const Stylus          = require('stylus');
const Auth            = require('./helpers/authenticator');
const Session         = require('express-session');
const Flash           = require('connect-flash');

/* Express Core */
const app = Express();

// Get key from environment variables
// Error if Such Key Not Found. Important for Session Security
// Generate a random key on development environment.
if (!process.env.SESS_KEY && app.get('env') !== 'development') {
  throw new Error('Crictical Error: No Crypt Words Defined. This word is important for maintain user security');
}
const secret_key = app.get('env') === 'development' ? Auth.SHA256(Math.random()) : process.env.SESS_KEY;

/* Load Various Supporting Middleware */

app.set('views', Path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(Stylus.middleware({
  src: Path.join(__dirname, 'assets'),
  dest: Path.join(__dirname, 'public/assets'),
  compress: app.get('env') === 'development' ? false : true
}));
app.use(Express.static(Path.join(__dirname, 'public')));

// Post Body Parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Cookie Parser
app.use(cookieParser(secret_key));

// Session
Auth.SessionStore.sync();
app.use(Session({
  secret: secret_key,
  store: Auth.SessionStore,
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

/* Authentication Stuffs */

// Create Authenticator
Auth.Passport.use(Auth.Strategy);

// Connect Authenticator to User Model
Auth.Passport.serializeUser(Auth.Serialize);
Auth.Passport.deserializeUser(Auth.deSerialize);

// Attach Authenticator
app.use(Auth.Passport.initialize());
app.use(Auth.Passport.session());

// Expose User Instance
app.use(Auth.GlobalUser());

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
  // set locals, only providing error in development
  res.locals.message = err.message;
  /* FIXME: Cleanup when push to production stage
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  */
  res.locals.error = err;

  // render the error page
  res.status(err.status || 500).render('error', {
    title: 'Express'
  });
});

module.exports = app;
