var models = require('../models/index')
,   Promise = require("bluebird")
,   bcrypt = require('bcryptjs')

exports.retrieveUser =
  function retrieveUser(username_or_email, model_name ){
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
      }).catch(function(e){
        //NOTE: probable database error, others?
        e.message = 'database error: ' + e.message;
        throw e;
      })
  }

exports.retrieveUserAndCheckPassword =
  function retrieveUserAndCheckPassword(username_or_email, password, model_name){
    return exports.retrieveUser(username_or_email, model_name).then(function(found_user){
      if(bcrypt.compareSync(password, found_user.password))
        return found_user;
      else
        throw new Error('incorrect password');
    }).catch(function(e){
      if((e instanceof TypeError) && (e.message === 'Cannot read property \'password\' of null'))
        throw new Error('incorrect user');
      else
        throw e;
    })
  }
