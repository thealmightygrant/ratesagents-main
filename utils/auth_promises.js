var data_promises = require('./data_promises')
,   Promise = require("bluebird")
,   models = require('../models/index')

//TODO: this function is fairly ugly, refactor, look into better promise chaining.
exports.facebookLoginVerify = function facebookLoginVerify(token, refreshToken, profile, model_name){
  //TODO: session is being saved after authentication, causing failure on the next tick
  //NOTE: there's only a login because they can register or login via this endpoint
  return data_promises.retrieveFBAccount(profile.id)
    .then(function(fbAccount){
      //NOTE: theyve never logged in or registered with us via fb
      if(!fbAccount) {
        return models.facebookAccount.create({
          accessToken: token,
          refreshToken: refreshToken,
          id: profile.id
        }).then(function(fbAccount){
          //TODO: they may have a regular login, we need to check that here
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
              facebookAccountId: fbAccount.id 
            })
          }
          else {
            user_creation_promise = models[model_name].findOrCreate({
              where: {
                email: email
              },
              defaults: {
                email: email,
                username: username,
                name: name,
                userType: model_name,
                facebookAccountId: fbAccount.id 
              }
            })
          }

          return user_creation_promise.spread(function(user, created){
            //NOTE: if there is a regular login, update fb account id
            if((typeof(created) !== 'undefined') && !created)
              return models[model_name].update({
                facebookAccountId: fbAccount.id
              }, {
                where: {
                  id: user.id 
                }
              }).then(function(created){
                console.log("updated? ", created)
                return user;
              })
            else
              return user;
          })
        }).catch(function(e){
          throw e;
        })
      }
      else{
        //success redirect fails here when not already logged in...
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


exports.localLoginVerify = function localLoginVerify(req, username, password, model_name){
  return data_promises.retrieveUser(username, model_name)
    .then(function(user){
      if(!user)
        return [false, req.flash('messages', {error_msg: 'Sorry, but we couldn\'t find that user'})]
      else {
        //TODO: look into if this is the right way to set this up, or if there is some other way to cascade them 
        return data_promises.checkPassword(user, password).then(function(user){
          console.log("user: ", user)
          if(!user)
            return [false, req.flash('messages', {error_msg: 'Sorry, but that password isn\'t correct'})];
          else
            return [user, req.flash('messages', {success_msg: 'Welcome!!!'})];
        })
      }
    })
    .catch(function(e){
      throw e;
    })
}

exports.localRegisterVerify = function localRegisterVerify(req, username, password, model_name){
  return models[model_name].create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      username: req.body.username,
      userType: model_name,
      facebookAccountId: null
    })
    .then(function(user){
      return [user, req.flash('messages', {success_msg: "You just signed up for Rates and Agents!"})];
    })
    .catch(function(e){
      throw e;
    })
}

