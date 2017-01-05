const Promise = require("bluebird")
const retrieveUserViaFB = require('./model_promises').retrieveUserViaFB
,     retrieveUserViaEmail = require('./model_promises').retrieveUserViaEmail
,     checkUserPassword = require('./model_promises').checkUserPassword
,     retrieveFBAccount = require('./model_promises').retrieveFBAccount
,     createUserViaEmail = require('./model_promises').createUserViaEmail
,     createUserViaFB = require('./model_promises').createUserViaFB
,     createFBAccount = require('./model_promises').createFBAccount
const models  = require('../models/index')

exports.facebookLoginVerify = function facebookLoginVerify(token, refreshToken, profile, modelName){
  //NOTE: there's only a login because they can register or login via this endpoint
  return retrieveFBAccount(parseInt(profile.id))
    .then(function(fbAccount){
      //NOTE: theyve never logged in or registered with us via fb
      if(!fbAccount) {
        return createFBAccount(token, refreshToken, profile.id)
          .then(function(fbAccount){
            return createUserViaFB(fbAccount, profile, modelName)
          })
      }
      else{
        return retrieveUserViaFB(fbAccount, modelName)
          .then(function(user){
            console.log("user: ", user)
            if(!user){
              //NOTE: this basically means an orphaned FB account, cleanest option might be to delete the FB account.
              //TODO: an option here would be to create a new user...
              return false;
            }
            else {
              return user;
            }
          })
      }
    })
}


exports.localLoginVerify = function localLoginVerify(req, email, password, modelName){
  const passthroughData = {email: email}
  return retrieveUserViaEmail(email, modelName)
    .then(function(user){
      const phrase = 'We can\'t find that email. Maybe you registered via Facebook?'
      if(!user)
        return [false, {messages: {email: phrase}, data: passthroughData}]
      else {
        //TODO: look into if this is the right way to set this up, or if there is some other way to cascade promises
        return checkUserPassword(user, password).then(function(user){
          const cemail = email.charAt(0).toUpperCase() + email.slice(1);
          const phrase = cemail.split('@')[0] +
                ', go home. You\'re drunk. That\'s not your password.'
          if(!user)
            return [false, {messages: {password: phrase}, data: passthroughData}];
          else
            return [user, {}];
        })
      }
    })
    .catch(function(e){
      throw e;
    })
}

exports.localRegisterVerify = function localRegisterVerify(req, email, password, modelName){
  return createUserViaEmail(email, password, modelName);
}
