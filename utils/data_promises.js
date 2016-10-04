var models = require('../models/index')
,   Promise = require("bluebird")
,   bcrypt = require('bcryptjs')

exports.retrieveUser =
  function retrieveUser(username_or_email, model_name ){
    return models[model_name].findOne({
      where: {
        $or: [
          {
            username: username_or_email
          },
          {
            email: username_or_email
          }
        ]
      }
    }) 
      .then(function(found_user) {
        if(found_user !== null)
          return found_user;
        else
          throw Error('incorrect user')
      })
      .catch(function(e){
        e.message = 'database error: ' + e.message;
        throw e;
      })
  }

exports.checkPassword =
  function checkPassword(username_or_email, password, model_name){
    return exports.retrieveUser(username_or_email, model_name)
      .then(function(found_user){
        if(bcrypt.compareSync(password, found_user.password))
          return found_user;
        else
          throw new Error('incorrect password');
      })
      .catch(function(e){
        if((e instanceof TypeError) && (e.message === 'Cannot read property \'password\' of null'))
          throw new Error('incorrect user');
        else
          throw e;
      })
  }

exports.session =
  function session(req, function_name, extra_data){
    var session_promise = Promise.promisify(req.session[function_name].bind(req.session))().bind(req);
    if(!extra_data) extra_data = {};
    return session_promise.then(function(){
      extra_data.req = this;
      return extra_data;
    }).catch(function(e){
      e.message = 'session error: ' + e.message
      throw e;
    })
  }
