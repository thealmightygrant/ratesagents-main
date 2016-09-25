var models = require('../models/index')
,   Promise = require("bluebird")
,   bcrypt = require('bcryptjs')

exports.retrieveUser = function(username_or_email, model_name ){
  return Promise.any(
    [
      models[model_name].find({
        where: {
          username: username_or_email
        }
      }),
      models[model_name].find({
        where: {
          email: username_or_email
        }
      })
    ]).then(function(found_user) {
      return found_user;
    }).catch(function(error){
      //rethrow, we'll handle in login or wherever else this is called
      throw e;
    })
}

exports.retrieveUserAndCheckPassword = function(username_or_email, password, model_name){
  return exports.retrieveUser(username_or_email, model_name).then(function(found_user){
    if(bcrypt.compareSync(password, found_user.password))
      return found_user;
    else
      return false;
  }).catch(function(error){
    throw e;
  })
}
