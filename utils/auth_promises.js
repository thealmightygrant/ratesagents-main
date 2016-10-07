var data_promises = require('./data_promises')
,   models = require('../models/index')


exports.facebookLoginVerify = function facebookLoginVerify(token, refreshToken, profile, model_name){
  //NOTE: there's only a login because they can register or login via this endpoint
  return data_promises.retrieveFBAccount(profile.id)
    .then(function(fbAccount){
      console.log("fbAccount: ", fbAccount)
      console.log(profile);
      //NOTE: theyve never logged in or registered with fb
      if(!fbAccount) {
        models.facebookAccount.create({
          accessToken: token,
          refreshToken: refreshToken,
          profileId: profile.id
        }).then(function(fbAccount){
          return models[model_name].create({
            email: profile.emails && profile.emails.length ? profile.emails[0].value : null,
            username: profile.username || profile.displayName.replace(" ", "").toLowerCase() || profile.id,
            name: profile.displayName || model_name,
            userType: model_name,
            facebookAccountId: fbAccount.id
          }).then(function(user){
            return user;
          })
        }).catch(function(e){
          throw e;
        })
      }
      else{
        return data_promises.retrieveUserViaFB(fbAccount, model_name)
          .then(function(user){
            console.log("user: ", user)
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
      userType: model_name
    })
    .then(function(user){
      return [user, req.flash('messages', {success_msg: "You just signed up for Rates and Agents!"})]
    })
    .catch(function(e){
      throw e;
    })
}

