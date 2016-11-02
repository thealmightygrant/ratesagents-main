import express from 'express'

import 'pg'
import 'pg-hstore'

import passport from 'passport'
import helmet from 'helmet'
import bodyParser from 'body-parser'

import expresshbs from 'express-handlebars'
import HBars from 'handlebars'

import expressValidator from 'express-validator'
import cookieSession from 'cookie-session'

import conf from './config'

import helpers from './utils/hb_helpers'
import validators from './utils/validators'
import strategies from './utils/strategies'
import middleware from './utils/middleware'

import routes from './routes/index'
import realtors from './routes/realtors'
import homeowners from './routes/homeowners'
import models from './models/index'

var app = express();

app.engine('hbs', expresshbs({defaultLayout: 'layout-base',
                              handlebars: HBars,
                              helpers: helpers,
                              extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(helmet());

app.use(bodyParser.json());
//TODO: extended determines type of querystring parsing, look into this once parsing qs's
app.use(bodyParser.urlencoded({ extended: false }));

// css, js, html, etc...should be served by nginx otherwise
if(conf.get('env') === 'development')
  app.use(express.static(__dirname + "/client_side/dist" ));

var sessOptions = {
  name: 'session'
  , keys: conf.get('session').keys
  , cookie: {
    httpOnly: true  //true is default, does not allow client-side JS to read document.cookie
    , expires: new Date( Date.now() + 30 * 24 * 60 * 60 * 1000 ) //thirty days from now in ms
    , maxAge: (30 * 24 * 60 * 60 * 1000) //30 days in ms
  }
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy, aka nginx
  sessOptions.cookie.secure = true // serve secure cookies
  sessOptions.cookie.domain = conf.get('domain')
  //TODO: set path here and confirm cookie paths??
  //      see here: https://expressjs.com/en/advanced/best-practice-security.html
  sessOptions.proxy = true
}

// session
app.use(cookieSession(sessOptions));

// initialize passport
app.use(passport.initialize());
app.use(passport.session());
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

app.use(middleware.addMessages);

app.use('/', routes)
app.use('/realtors', realtors)
app.use('/homeowners', homeowners)

app.use(middleware.logErrors);
app.use(middleware.clientErrorHandler);
app.use(middleware.errorHandler);

app.set('port', conf.get('port'));
app.listen(conf.get('port'), onListening)

function onListening(){
  console.log('Server started on port: ' + app.get('port'))
}
