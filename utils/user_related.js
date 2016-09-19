var ra_utils = require('./utils')
,   models = require('../models/index')
,   bcrypt = require('bcryptjs')
,   Promise = require("bluebird")

exports.login = function(options, req, res){
  //options.err_view / options.suc_view = string (name of a view)
  //options.model_name = string (name of a model)
  //options.des_err_msgs = { name_of_input { error_type: string}, ...}
  //req = Express HTTP request
  //res = Express HTTP response

  console.log(options)

  var username = req.body.username
  ,   password = req.body.password
  ,   err_msgs = {}
  ,   errors = []
  ,   options = typeof(options) !== 'undefined' ? options : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'realtor-login'
  ,   suc_view = typeof(options.suc_view) === 'string' ? options.suc_view : 'realtor-sales'
  ,   model_name = typeof(options.model_name) === 'string' ? options.model_name : "Realtor"

  err_msgs.username = {};
  err_msgs.password = {};

  if(typeof(options.des_err_msgs) !== 'undefined')
  {
    err_msgs.username.empty = err_msgs.username.empty;
    err_msgs.password.empty = err_msgs.password.empty;
  }
  else
  {
    err_msgs.username.empty = 'Please give us your username or email :D';
    err_msgs.password.empty = 'Please tell us your password. Don\'t keep us waiting :(';
  }

  req.checkBody('username', err_msgs.username.empty ).notEmpty();
  req.checkBody('password', err_msgs.password.empty ).notEmpty();

  if(req.validationErrors())
    errors = errors.concat(req.validationErrors());

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
          console.log('found a user!!!');
          if(bcrypt.compareSync(password, found_user.password))
          {
            console.log("passwords matched!!");
            res.render(suc_view, {
              user: found_user
            })
          }
          else
          {
            //TODO: add an error for no match to the errors object, it should contain at least a msg
            errors.splice(errors.length, 0, { param: 'password'
                                            , msg: 'Sorry. That password did not match user: ' + username
                                            , value: password })
            res.render(err_view, {
               username: username,
               errors: errors
             })
           //console.log("passwords did not match!!!");
          }
        })
  }
}
