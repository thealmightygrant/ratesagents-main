var express = require('express');
var path = require('path');
var logger = require('morgan');
var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var pg = require('pg');
var hstore = require('pg-hstore')();

var bodyParser = require('body-parser');
var expresshbs = require('express-handlebars');
var HBars = require('handlebars');
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(expressSession.Store);

var env       = process.env.NODE_ENV || 'development';
var helpers = require('./utils/hb_helpers');
var validators = require('./utils/validators');
var middleware = require('./utils/middleware');
var routes = require('./routes/index');
var realtors = require('./routes/realtors');
var homeowners = require('./routes/homeowners');
var models = require('./models/index')

var app = express();

app.set('views', path.join(__dirname, 'views'));

app.engine('hbs', expresshbs({defaultLayout: 'layout-base',
                              handlebars: HBars,
                              helpers: helpers,
                              extname: '.hbs'}));

app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// css, js, html, etc...should be served by nginx otherwise
if(env === 'development')
  app.use(express.static(path.join(__dirname, 'static')));

// session
app.use(expressSession({
  // TODO: setup config for session, use high entropy secret
  secret: 'secretsecret'
  , saveUninitialized: true
  , resave: true
  , store: new SequelizeStore({
    // The maximum age (in milliseconds) of a valid session.
    // two weeks is default as of 9-27-16
    expiration: 14 * 24 * 60 * 60 * 1000
    // The interval at which to clean up sessions
    // 2 hours is default as of 9-27-16
    , checkExpirationInterval: 2 * 60 * 60 * 1000
    , db: models.sequelize
  })
  //TODO: when SSL added (from SequelizeStore docs)
  // proxy: true // if you SSL is done outside of node.
  
  // TODO: once https is setup
  //, cookie: { secure: true
  //          , maxAge: 2592000000 //30 days in ms
  //          }
}));

//passport init
app.use(passport.initialize());
app.use(passport.session());

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

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function(){
  console.log('Server started on port: ' + app.get('port'))
})

