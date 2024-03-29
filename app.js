var express = require('express');
//var flash = require('connect-flash');
var helmet = require('helmet');

var bodyParser = require('body-parser');

var expresshbs = require('express-handlebars');
var HBars = require('handlebars');
var expressValidator = require('express-validator');
var cookieSession = require('cookie-session');

var passport = require('passport')
var conf = require('./config')

var helpers = require('./utils/hb_helpers');
var validators = require('./utils/validators');
var strategies = require('./utils/strategies');
var utilWares = require('./middlewares/utils');
var routes = require('./routes/index');
var realtors = require('./routes/realtors');
var homeowners = require('./routes/homeowners');
var models = require('./models/index');

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
//TODO: look into switching to Redis
//NOTE: for now keep session size below 4093 bytes, see: https://github.com/expressjs/cookie-session
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
  customValidators: validators
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

//TODO: add back in if needed
//app.use(flash());
app.use(utilWares.addMessages);

app.use('/', routes)
app.use('/realtors', realtors)
app.use('/homeowners', homeowners)

app.use(utilWares.logErrors);
app.use(utilWares.clientErrorHandler);
app.use(utilWares.errorHandler);

app.set('port', conf.get('port'));
app.listen(conf.get('port'), onListening)

function onListening(){
  console.log('Server started on port: ' + app.get('port'))
}
