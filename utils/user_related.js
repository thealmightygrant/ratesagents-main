var ra_utils = require('./utils')
,   data_promises = require('./data_promises')
,   models = require('../models/index')
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

exports.register = function(req, res){

  var name = req.body.name
  ,   email = req.body.email
  ,   username = req.body.username
  ,   password = req.body.password
  ,   passwordconfirm = req.body.passwordconfirm
  ,   options = typeof(res.locals) !== 'undefined' ? res.locals : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'realtor-login'
  ,   success_url = typeof(options.success_url) === 'string' ? options.success_url : '/'
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
      var newUser = models[model_name].create({
        email: email,
        name: name,
        password: password,
        username: username
      }).then(function(user) {
        req.flash('success_msg', "You just successfully registered!");
        res.redirect(success_url);
      });
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

exports.login = function(req, res){
  //options.err_view / options.suc_view = string (name of a view)
  //options.model_name = string (name of a model)
  //options.des_err_msgs = { name_of_input { error_type: string}, ...}
  //req = Express HTTP request
  //res = Express HTTP response

  var username = req.body.username
  ,   password = req.body.password
  ,   errors = []
  ,   options = typeof(res.locals) !== 'undefined' ? res.locals : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'realtor-login'
  ,   success_url = typeof(options.success_url) === 'string' ? options.success_url : '/'
  ,   model_name = typeof(options.model_name) === 'string' ? options.model_name : "realtor"

  var err_msgs = retrieveErrorMsgs(['username', 'password']);
 
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
    data_promises.retrieveUserAndCheckPassword(username, password, model_name ).then(function(user){
      req.flash('success_msg', 'You just successfully logged in!')
      res.redirect(success_url);
    }).catch(function (e){
      if (e.message === 'incorrect user') {
        res.render(err_view, {
          username: username,
          errors: [{msg: 'Sorry, but we couldn\'t find that user',
                    parameter: 'username',
                    value: 'incorrect'}]
        })
      }
      else if (e.message === 'incorrect password') {
        res.render(err_view, {
          username: username,
          errors: [{msg: 'Sorry, but that password isn\'t correct',
                    parameter: 'password',
                    value: 'incorrect'}]
        })
      }
      else {
        res.render(err_view, {
          username: username,
          errors: [{msg: e.message,
                    parameter: e.name}]
        })
      }
    })
  }
}


