var express = require('express');
var path = require('path');
var logger = require('morgan');
var flash = require('connect-flash');
var pg = require('pg');
var hstore = require('pg-hstore')();

var methodOverride = require('method-override');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var expresshbs = require('express-handlebars');
var HBars = require('handlebars');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(expressSession.Store);

var passport = require('passport')

var env       = process.env.NODE_ENV || 'development';
var helpers = require('./utils/hb_helpers');
var validators = require('./utils/validators');
var strategies = require('./utils/strategies');
var middleware = require('./utils/middleware');
var routes = require('./routes/index');
var realtors = require('./routes/realtors');
var homeowners = require('./routes/homeowners');
var models = require('./models/index');

var appConfig = require('./config/app');

var app = express();

app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', expresshbs({defaultLayout: 'layout-base',
                              handlebars: HBars,
                              helpers: helpers,
                              extname: '.hbs'}));

app.set('view engine', 'hbs');

app.use(methodOverride());
var allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.send(200);
  }
  else {
    next();
  }
};
app.use(allowCrossDomain);
app.use(bodyParser.json());
//TODO: extended determines type of querystring parsing, look into this once parsing qs's
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser(appConfig.session.secret));

// css, js, html, etc...should be served by nginx otherwise
if(env === 'development')
  app.use(express.static(__dirname + "/client_side/dist" ));

var sessOptions = {
  secret: appConfig.session.secret
  , saveUninitialized: true
  , resave: false
  , cookie: {
    httpOnly: true,  //true is default, does not allow client-side JS to read document.cookie
    maxAge: 2592000000 //30 days in ms
  }
  //TODO: look into other possibilities for session storage
  //      secure cookies might be an option (with something like node-client-sessions)
  //      redis or mongo are other possibilities
  , store: new SequelizeStore({
    // The interval at which to clean up sessions
    // 2 hours is default as of 9-27-16
    checkExpirationInterval: 2 * 60 * 60 * 1000
    , db: models.sequelize
  })
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy, aka nginx
  sessOptions.cookie.secure = true // serve secure cookies
  sessOptions.proxy = true
}

// session
app.use(expressSession(sessOptions));

// initialize passport
app.use(passport.initialize());
app.use(passport.session({pauseStream: true}));
passport.use('realtor-local-login', strategies.realtorLocalLogin);
passport.use('homeowner-local-login', strategies.homeownerLocalLogin);
passport.use('realtor-local-register', strategies.realtorLocalRegister);
passport.use('homeowner-local-register', strategies.homeownerLocalRegister);
passport.use('realtor-fb-login', strategies.realtorFacebookLogin);
passport.use('homeowner-fb-login', strategies.homeownerFacebookLogin);
passport.serializeUser(strategies.serializer);
passport.deserializeUser(strategies.deserializer);

//validator (from GH page for express-validator)
app.use(expressValidator({
  customValidators:{
    isEmailAvailable: validators.isEmailAvailable
    , isUsernameAvailable: validators.isUsernameAvailable
  }
  , errorFormatter: function(param, msg, value){
    var namespace = param.split('.')
    ,   root = namespace.shift()
    ,   formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }

    return {
      param: formParam
      , msg: msg
      , value: value
    };
  }
}));

app.use(flash());
app.use(middleware.flashMsgs);

app.use('/', routes)
app.use('/realtors', realtors)
app.use('/homeowners', homeowners)

app.use(middleware.logErrors);
app.use(middleware.clientErrorHandler);
app.use(middleware.errorHandler);

var port = normalizePort(process.env.PORT, 3000);
app.set('port', port);
app.listen(port, onListening)

function onListening(){
  console.log('Server started on port: ' + app.get('port'))
}

function normalizePort(port, defaultPort){
  if(typeof(port) === 'string')
    return parseInt(port);
  else if(typeof(port) === 'number')
    return port;
  else
    return defaultPort;
}
