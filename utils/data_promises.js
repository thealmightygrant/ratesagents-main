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
          return false;
      })
      .catch(function(e){
        e.message = 'database error: ' + e.message;
        throw e;
      })
  }

exports.retrieveUserById =
  function retrieveUserById(user_id, model_name ){
    return models[model_name].findOne({
      where: {
        id: user_id
      }
    })
      .then(function(found_user) {
        if(found_user !== null)
          return found_user;
        else
          return false;
      })
      .catch(function(e){
        e.message = 'database error: ' + e.message;
        throw e;
      })
  }


exports.retrieveFBAccount =
  function retrieveFBAccount(fb_id){
    if(!fb_id)
      return false;
    else {
      return models.facebookAccount.findOne({
        where: {
          id: fb_id
        }
      })
        .then(function(fbAccount) {
          //console.log("found fb account: ", fbAccount)
          if(fbAccount !== null)
            return fbAccount;
          else
            return false;
        })
        .catch(function(e){
          e.message = 'database error: ' + e.message;
          throw e;
        })
    }
  }

exports.retrieveUserViaFB =
  function retrieveUserViaFB(fbAccount, model_name){
    return models[model_name].findOne({
      where: {
        facebookAccountId: parseInt(fbAccount.id)
      }
    })
      .then(function(user){
        if(user !== null)
          return user;
        else
          return false;
      })
      .catch(function(e){
        e.message = 'database error: ' + e.message;
        throw e;
      })
  }

exports.checkPassword =
  function checkPassword(user, password){
    return Promise.try(function(){
      if(bcrypt.compareSync(password, user.password))
        return user;
      else
        return false;
    }).catch(function(e){
      e.message = 'password check error: ' + e.message;
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
