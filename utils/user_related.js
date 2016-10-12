var ra_utils = require('./utils')
,   data_promises = require('./data_promises')
,   Promise = require("bluebird")

var default_err_msgs = {
  name: {
    empty: 'Please tell us your name :D'
  }
  , email: {
    empty: 'Please tell us your email :D'
    , fake: 'Please tell us a REAL email.'
    , in_use: 'Sorry, but the email has already been used to sign up. Please try logging in'
  }
  , username: {
    empty: 'Please give us your username :D'
    , isnt_weird: 'Sorry, but your username needs to contain only numbers, letters, dashes, and underscores.'
    , in_use: 'Sorry, but that username is already in use. Please select another one.'
  }
  , password: {
    empty: 'Please tell us your password. Don\'t keep us waiting.'
    , match: 'Sorry, these passwords don\'t match. Please try again'
  }
}

function retrieveErrorMsgs(desired_atts, des_err_msgs){
  var att, msg;
  var err_msgs = {};

  desired_atts.forEach(function(att){
    err_msgs[att] = {}
  });

  if(typeof(des_err_msgs) !== 'undefined')
  {
    for (att in des_err_msgs) { err_msgs[att] = des_err_msgs[att]; }
  }

  for(att in default_err_msgs){
    for(msg in default_err_msgs[att]){
      if(err_msgs[att] && !err_msgs[att][msg])
        err_msgs[att][msg] = default_err_msgs[att][msg];
    }
  }

  return err_msgs; 
}

exports.validateRegister = function(req, res, next){

  var name = req.body.name
  ,   email = req.body.email
  ,   username = req.body.username
  ,   password = req.body.password
  ,   passwordconfirm = req.body.passwordconfirm
  ,   options = typeof(res.locals) !== 'undefined' ? res.locals : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'realtor-login'
  ,   model_name = typeof(options.model_name) === 'string' ? options.model_name : "realtor"

  var err_msgs = retrieveErrorMsgs(['name', 'email', 'username', 'password'])

  //sanitizers
  req.sanitizeBody('email').normalizeEmail();

  //validators
  req.checkBody('name', err_msgs.name.empty ).notEmpty();
  req.checkBody('email', err_msgs.email.empty ).notEmpty();
  req.checkBody('username', err_msgs.username.empty ).notEmpty();
  req.checkBody('password', err_msgs.password.empty ).notEmpty();
  req.checkBody('passwordconfirm', err_msgs.password.match ).equals(req.body.password);

  if(!req.validationErrors()){
    //TODO: restrict password and name to certain characters?
    req.checkBody('email', err_msgs.email.fake ).isEmail();
    req.checkBody('username', err_msgs.username.isnt_weird ).matches(/[A-Za-z0-9_\-]+/);
  }

  if(!req.validationErrors()) {
    req.checkBody('email', err_msgs.email.in_use).isEmailAvailable(model_name);
    req.checkBody('username', err_msgs.username.in_use).isUsernameAvailable(model_name);
  }

  req.asyncValidationErrors()
    .then(function() {
      next()
    })
    .catch(function(errors) {
      res.render(err_view, {
        username: username,
        email: email,
        name: name,
        errors: errors
      })
    });
}

exports.validateLogin = function(req, res, next){
  var username = req.body.username
  ,   password = req.body.password
  ,   options = typeof(res.locals) !== 'undefined' ? res.locals : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'realtor-login'
  ,   err_msgs = retrieveErrorMsgs(['username', 'password']);

  //TODO: redirect to dashboard or something if already logged in, mayyybe

  req.checkBody('username', err_msgs.username.empty ).notEmpty();
  req.checkBody('password', err_msgs.password.empty ).notEmpty();

  if(req.validationErrors())
  {
    res.render(err_view, {
      username: username,
      errors: req.validationErrors()
    })
  }
  else
  {
    next();
  }
}

exports.isLoggedIn = function isLoggedIn(req, res, next) {
  console.log("testing authentication...")
  console.log(req.session);
  if (req.isAuthenticated()){
    console.log("passed authentication")
    res.locals.user = {
      name: req.user.name
      , userType: req.user.userType
      , username: req.user.username
      , email: req.user.email
    }
    return next();
  }
  console.log("failed authentication")
  return res.redirect('/'); 
}
