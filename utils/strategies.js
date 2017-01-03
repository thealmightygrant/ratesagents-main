const LocalStrategy = require('passport-local').Strategy
,     FacebookStrategy = require('passport-facebook').Strategy
,     retrieveUserViaId = require('./model_promises').retrieveUserViaId
,     authPromises = require('./auth_promises')
,     conf = require('../config.js')
,     configAuth = conf.get('auth')

function localLogin(modelName, req, username, password, done){
  return authPromises.localLoginVerify(req, username, password, modelName).asCallback(done, {spread: true});
}

function localRegister(modelName, req, username, password, done){
  return authPromises.localRegisterVerify(req, username, password, modelName).asCallback(done, {spread: true});
}

function facebookLogin(modelName, token, refreshToken, profile, done){
  return authPromises.facebookLoginVerify(token, refreshToken, profile, modelName).asCallback(done);
}

exports.serializer = function serializer(user, done){
  //TODO: serialize whole user instead of doing db lookup?
  done(null, {id: user.id, userType: user.userType});
}

exports.deserializer = function deserializer(user, done){
  const modelName = user.userType === 'homeowner' ? 'homeowner' : 'realtor';
  retrieveUserViaId(user.id, modelName).asCallback(done);
}

exports.realtorLocalLogin = new LocalStrategy(
  {
    passReqToCallback : true
    , usernameField: 'email'
    , passwordField: 'password'
  },
  localLogin.bind(null, "realtor"));

exports.homeownerLocalLogin = new LocalStrategy(
  {
    passReqToCallback : true
    , usernameField: 'email'
    , passwordField: 'password'
  },
  localLogin.bind(null, "homeowner"));

exports.realtorLocalRegister = new LocalStrategy(
  {
    passReqToCallback : true
    , usernameField: 'email'
    , passwordField: 'password'
  },
  localRegister.bind(null, "realtor"));

exports.homeownerLocalRegister = new LocalStrategy(
  {
    passReqToCallback : true
    , usernameField: 'email'
    , passwordField: 'password'
  },
  localRegister.bind(null, "homeowner"));

exports.realtorFacebookLogin = new FacebookStrategy({
  clientID        : configAuth.facebookAuth.clientID,
  clientSecret    : configAuth.facebookAuth.clientSecret,
  callbackURL     : configAuth.facebookAuth.realtorCallbackURL,
  enableProof     : true,
  profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name']
}, facebookLogin.bind(null, "realtor"));

exports.homeownerFacebookLogin = new FacebookStrategy({
  clientID        : configAuth.facebookAuth.clientID,
  clientSecret    : configAuth.facebookAuth.clientSecret,
  callbackURL     : configAuth.facebookAuth.homeownerCallbackURL,
  enableProof     : true,
  profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name']
}, facebookLogin.bind(null, "homeowner"));
