const models = require('../models/index')
,     Promise = require("bluebird")
,     bcrypt = require('bcryptjs')


module.exports = {
  retrieveUserViaEmail: retrieveUserViaEmail,
  retrieveUserViaFB: retrieveUserViaFB,
  retrieveUserViaId: retrieveUserViaId,
  retrieveFBAccount: retrieveFBAccount,
  retrieveListings: retrieveListings,
  retrieveItemViaId: retrieveItemViaId,
  checkUserPassword: checkUserPassword,
  createFBAccount: createFBAccount,
  createUserViaFB: createUserViaFB,
  createUserViaEmail: createUserViaEmail,
  updateModel: updateModel,
  //TODO: remove session? no longer in use atm AFAIK 1/2017
  session: session
}


function retrieveUserViaEmail(email, model_name ){
  return models[model_name].findOne({
    where: {
      email: email
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

function retrieveUserViaId(user_id, model_name ){
  return retrieveItemViaId(user_id, model_name);
}

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

function retrieveListings(user_id, model_name, options){
  if(!user_id || !model_name)
    return [];
  else {
    return models[model_name].findOne({
      where: {
        id: user_id
      }
    })
      .then(function(user){
        return user.getListings(options);
      })
      .catch(function(e){
        e.message = 'database error: ' + e.message;
        throw e;
      })
  }
}

function retrieveItemViaId(id, model_name){
  if(!id)
    return null;
  else {
    return models[model_name].findOne({
      where: {
        id: id
      }
    })
      .then(function(item){
        return item;
      }).catch(function(e){
        e.message = 'database error: ' + e.message;
        throw e;
      })
  }
}

function checkUserPassword(user, password){
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

function createUserViaFB(fbAccount, profile, modelName){

  const email = profile.emails && profile.emails.length ? profile.emails[0].value : null
  ,     username = profile.username || profile.displayName.replace(/\s/g, "").toLowerCase() || profile.id
  ,     name = profile.displayName || modelName
  let userCreationPromise = null

  //NOTE: existing user that creates a duplicate account by accidentally logging in causes issues here
  //      the only way to check this is to check the email they used with facebook against the email
  //      they used for our site. We might be able to do a similar check for duplicate accounts using a
  //      CC token?
  if(!email){
    userCreationPromise = models[modelName].create({
      email: email,
      username: username,
      name: name,
      userType: modelName,
      facebookAccountId: parseInt(fbAccount.id)
    })
  }
  else {
    userCreationPromise = models[modelName].findOrCreate({
      where: {
        email: email
      },
      defaults: {
        email: email,
        username: username,
        name: name,
        userType: modelName,
        facebookAccountId: parseInt(fbAccount.id)
      }
    })
  }

  return userCreationPromise.spread(function(user, created){
    //NOTE: if there is an account was not created, then add the fbAccount to it.
    if((typeof(created) !== 'undefined') && !created) {
      return updateModel({facebookAccountId: parseInt(fbAccount.id)}, user.id, modelName)
        .then(function(created){
          console.log("updated? ", created)
          return user;
        })
    }
    else {
      console.log("user created via fb: ", user);
      return user;
    }
  })
}

function createUserViaEmail(email, password, modelName){
  const username = email.split('@')[0];
  //default username to email split at @ sign
  return models[modelName].create({
    email: email,
    username: username,
    userType: modelName,
    password: password
  })
}

function updateModel(updates, modelId, modelName){
  let updatedParams = {}
  Object.keys(updates).forEach(function(key){
    if(updates[key])
      updatedParams[key] = updates[key]
  })
  return models[modelName].update(updatedParams, { where: {id: modelId} });
}

function createFBAccount(token, refreshToken, profileId){
  return models.facebookAccount.create({
    accessToken: token,
    refreshToken: refreshToken,
    id: parseInt(profileId)
  });
}

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
