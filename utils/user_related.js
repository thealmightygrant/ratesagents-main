var ra_utils = require('./utils')
,   models = require('../models/index')
,   bcrypt = require('bcryptjs')
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

exports.register = function(options, req, res){

  var name = req.body.name
  ,   email = req.body.email
  ,   username = req.body.username
  ,   password = req.body.password
  ,   passwordconfirm = req.body.passwordconfirm
  ,   options = typeof(options) !== 'undefined' ? options : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'realtor-login'
  ,   suc_view = typeof(options.suc_view) === 'string' ? options.suc_view : 'realtor-sales'
  ,   model_name = typeof(options.model_name) === 'string' ? options.model_name : "Realtor"

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
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(password, salt);
      var newUser = models[model_name].create({
        email: email,
        name: name,
        password: hash,
        username: username
      }).then(function(user) {
        res.render(suc_view, {
          user: user
        })
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

exports.login = function(options, req, res){
  //options.err_view / options.suc_view = string (name of a view)
  //options.model_name = string (name of a model)
  //options.des_err_msgs = { name_of_input { error_type: string}, ...}
  //req = Express HTTP request
  //res = Express HTTP response

  //console.log(options)

  var username = req.body.username
  ,   password = req.body.password
  ,   errors = []
  ,   options = typeof(options) !== 'undefined' ? options : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'realtor-login'
  ,   suc_view = typeof(options.suc_view) === 'string' ? options.suc_view : 'realtor-sales'
  ,   model_name = typeof(options.model_name) === 'string' ? options.model_name : "Realtor"

  var err_msgs = retrieveErrorMsgs(['username', 'password']);
 
  req.checkBody('username', err_msgs.username.empty ).notEmpty();
  req.checkBody('password', err_msgs.password.empty ).notEmpty();

  if(req.validationErrors())
  {
    errors = errors.concat(req.validationErrors());
  }

  if(errors.length > 0)
  {
    res.render(err_view, {
      username: username,
      errors: errors
    })
  }
  else
  {
    Promise.any(
      [
        models[model_name].find({
          where: {
            username: username
          }
        }),
        models[model_name].find({
          where: {
            email: username
          }
        })]).then(function(found_user) {
          if(bcrypt.compareSync(password, found_user.password))
          {
            res.render(suc_view, {
              user: found_user
            })
          }
          else
          {
            errors = [{ param: 'password'
                        , msg: 'Sorry. That password did not match user: ' + username
                        , value: password }]
            res.render(err_view, {
               username: username,
               errors: errors
             })
          }
        }).catch(TypeError, function(error) {
          res.render(err_view, {
            username: username,
            errors: [{ param: 'username'
                       , msg: 'We couldnt find that username or email...Did you sign up with a different one?'
                       , value: username }]
          })
        }).catch(function(error){
          if(error){
            res.render(err_view, {
              username: username,
              errors: [{ param: 'username'
                         , msg: error
                         , value: username }]
            })
          }
        })
  }
}


