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
var expressValidator = require('express-validator');
var expressSession = require('express-session');
var SequelizeStore = require('connect-session-sequelize')(expressSession.Store);

var validators = require('./utils/validators');
var routes = require('./routes/index');
var realtors = require('./routes/realtors');
var homeowners = require('./routes/homeowners');
var models = require('./models/index')

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', expresshbs({defaultLayout: 'layout-base',
                                     extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// css, js, html, etc
app.use(express.static(path.join(__dirname, 'static')));

// session
app.use(expressSession({
  // TODO: setup password config for session
  secret: 'secretsecret'
  , saveUninitialized: true
  , resave: true
  , store: new SequelizeStore({
    db: models.sequelize
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

app.use(function(req, res, next){
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', routes)
app.use('/realtors', realtors)
app.use('/homeowners', homeowners)

app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function(){
  console.log('Server started on port: ' + app.get('port'))
})

