var data_promises = require('./data_promises')
,   Promise = require("bluebird")
,   models = require('../models/index')

//TODO: this function is fairly ugly, refactor, look into better promise chaining.
exports.facebookLoginVerify = function facebookLoginVerify(token, refreshToken, profile, model_name){
  //NOTE: there's only a login because they can register or login via this endpoint
  return data_promises.retrieveFBAccount(parseInt(profile.id))
    .then(function(fbAccount){
      //NOTE: theyve never logged in or registered with us via fb
      if(!fbAccount) {
        return models.facebookAccount.create({
          accessToken: token,
          refreshToken: refreshToken,
          id: parseInt(profile.id)
        }).then(function(fbAccount){
          //NOTE: they may have a regular login, we need to check that here
          var email = profile.emails && profile.emails.length ? profile.emails[0].value : null
          ,   username = profile.username || profile.displayName.replace(/\s/g, "").toLowerCase() || profile.id
          ,   name = profile.displayName || model_name
          ,   user_creation_promise = null

          if(!email){
            user_creation_promise = models[model_name].create({
              email: email,
              username: username,
              name: name,
              userType: model_name,
              facebookAccountId: parseInt(fbAccount.id)
            })
          }
          else {
            //TODO: this findOrCreate is all f'd up...still?
            user_creation_promise = models[model_name].findOrCreate({
              where: {
                email: email
              },
              defaults: {
                email: email,
                username: username,
                name: name,
                userType: model_name,
                facebookAccountId: parseInt(fbAccount.id)
              }
            })
          }

          return user_creation_promise.spread(function(user, created){
            //NOTE: if there is a regular login, update fb account id
            if((typeof(created) !== 'undefined') && !created) {
              return models[model_name].update({
                facebookAccountId: parseInt(fbAccount.id)
              }, {
                where: {
                  id: user.id
                }
              }).then(function(created){
                console.log("updated? ", created)
                return user;
              })
            }
            else {
              console.log("user created via fb: ", user);
              return user;
            }
          })
        }).catch(function(e){
          throw e;
        })
      }
      else{
        return data_promises.retrieveUserViaFB(fbAccount, model_name)
          .then(function(user){
            console.log("user: ", !!user)
            if(!user)
              return false;
            else
              return user;
          })
      }
    })
    .catch(function(e){
      throw e;
    })
}


exports.localLoginVerify = function localLoginVerify(req, email, password, model_name){
  var passthroughData = {email: email}
  return data_promises.retrieveUser(email, model_name)
    .then(function(user){
      var phrase = 'We can\'t find that email. Maybe you registered via Facebook?'
      if(!user)
        return [false, {messages: {email: phrase}, data: passthroughData}]
      else {
        //TODO: look into if this is the right way to set this up, or if there is some other way to cascade promises
        return data_promises.checkPassword(user, password).then(function(user){
          var cemail = email.charAt(0).toUpperCase() + email.slice(1);
          var phrase = cemail.split('@')[0] +
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

exports.localRegisterVerify = function localRegisterVerify(req, email, password, model_name){

  return models[model_name].create({
      email: email
    , name: req.body.first_name + " " + req.body.last_name
    , password: password
    , username: req.body.username || email.split('@')[0]
    , userType: model_name
    , facebookAccountId: null
    })
    .then(function(user){
      return [user, {}];
    })
    .catch(function(e){
      throw e;
    })
}
