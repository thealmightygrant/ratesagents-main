var ra_utils = require('./utils')
,   data_promises = require('./data_promises')
,   Promise = require("bluebird")

var default_err_msgs = {
  first_name: {
    empty: 'Your first name can\'t be empty. What would we call you?'
  }
  , last_name: {
    empty: 'Your last name can\'t be empty. How would we stalk you?'
  }
  , email: {
    empty: 'Please tell us your email :D'
    , fake: 'Your email doesn\'t look right, can you please try again?'
    , in_use: 'Sorry, but that email has already been used to sign up. Please try logging in.'
  }
  , username: {
    empty: 'Please give us your username :D'
    , is_weird: 'Sorry, but your username needs to contain only numbers, letters, dashes, and underscores.'
    , in_use: 'Sorry, but that username is already in use. Please select another one.'
  }
  , password: {
    empty: 'Please tell us your password. Don\'t keep us waiting.'
    , strong: 'Your password is too weak, please try adding some symbols or making it longer.'
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

function arrangeValidationErrors(errors){
  var updatedErrors = {};
  errors.forEach(function(val, idx, arr){
    updatedErrors[val.param] = val.msg;
  })
  return updatedErrors;
}

exports.validateRegister = function(req, res, next){

  var name = req.body.name
  ,   email = req.body.email
  ,   first_name = req.body.first_name
  ,   last_name = req.body.last_name
  ,   password = req.body.password
  ,   options = typeof(res.locals) !== 'undefined' ? res.locals : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'realtor-login'
  ,   model_name = typeof(options.model_name) === 'string' ? options.model_name : "realtor"

  var err_msgs = retrieveErrorMsgs(['first_name', 'last_name', 'email', 'password'])

  //validators
  req.checkBody('first_name', err_msgs.first_name.empty ).notEmpty();
  req.checkBody('last_name', err_msgs.last_name.empty ).notEmpty();
  req.checkBody('email', err_msgs.email.empty ).notEmpty();
  req.checkBody('password', err_msgs.password.empty ).notEmpty();

  //sanitizers
  req.sanitizeBody('email').normalizeEmail();

  if(!req.validationErrors()){
    //TODO: restrict password and name to certain characters?
    req.checkBody('email', err_msgs.email.fake ).isEmail();
  }


  //TODO: this isn't working, for some reason the async validation is f'ed up
  //SOLUTION? move to be done in auth_promises...

  if(!req.validationErrors()) {
    req.checkBody('email', err_msgs.email.in_use).isEmailAvailable(model_name);
  }

  req.asyncValidationErrors()
    .then(function() {
      next()
    })
    .catch(function(errors) {
      console.log(errors);
      res.render(err_view, {
        data: {
          first_name: first_name,
          last_name: last_name,
          email: email,
          csrfToken: req.body._csrf
        }, messages: arrangeValidationErrors(errors)
      })
    });
}

exports.validateLogin = function(req, res, next){
  var email = req.body.email
  ,   password = req.body.password
  ,   options = typeof(res.locals) !== 'undefined' ? res.locals : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'realtor-login'
  ,   err_msgs = retrieveErrorMsgs(['email', 'password']);

  //TODO: redirect to dashboard or something if already logged in, mayyybe

  req.checkBody('email', err_msgs.email.empty ).notEmpty();
  req.checkBody('password', err_msgs.password.empty ).notEmpty();

  if(req.validationErrors())
  {
    res.render(err_view, {
      data: {
        email: email,
        csrfToken: req.body._csrf
      }, messages: arrangeValidationErrors(req.validationErrors())
    })
  }
  else
  {
    next();
  }
}

exports.isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    res.locals.user = {
      name: req.user.name
      , userType: req.user.userType
      , username: req.user.username
      , email: req.user.email
    }
    return next();
  }
  return res.redirect('/');
}
