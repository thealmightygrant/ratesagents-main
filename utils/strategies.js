var passport = require('passport')
,   LocalStrategy = require('passport-local').Strategy
,   FacebookStrategy = require('passport-facebook').Strategy
,   data_promises = require('./data_promises')
,   auth_promises = require('./auth_promises')
,   config_auth = require('../config/auth')

function localLogin(model_name, req, username, password, done){
  return auth_promises.localLoginVerify(req, username, password, model_name).asCallback(done, {spread: true});
}

function localRegister(model_name, req, username, password, done){
  return auth_promises.localRegisterVerify(req, username, password, model_name).asCallback(done, {spread: true});
}

function facebookLogin(model_name, token, refreshToken, profile, done){
  return auth_promises.facebookLoginVerify(token, refreshToken, profile, model_name).asCallback(done);
}

exports.serializer = function serializer(user, done){
  done(null, {id: user.id, userType: user.userType});
}

exports.deserializer = function deserializer(user, done){
  var model_name = user.userType === 'homeowner' ? 'homeowner' : 'realtor';
  
  //TODO: this should be updated to use straight id
  console.log("deserializing: ", user.id)
  data_promises.retrieveUserById(user.id, model_name).asCallback(done);
}

exports.realtorLocalLogin = new LocalStrategy(
  { passReqToCallback : true },
  localLogin.bind(null, "realtor"));

exports.homeownerLocalLogin = new LocalStrategy(
  { passReqToCallback : true },
  localLogin.bind(null, "homeowner"));

exports.realtorLocalRegister = new LocalStrategy(
  { passReqToCallback : true },
  localRegister.bind(null, "realtor"));

exports.homeownerLocalRegister = new LocalStrategy(
  { passReqToCallback : true },
  localRegister.bind(null, "homeowner"));

exports.realtorFacebookLogin = new FacebookStrategy({
  clientID        : config_auth.facebookAuth.clientID,
  clientSecret    : config_auth.facebookAuth.clientSecret,
  callbackURL     : config_auth.facebookAuth.realtorCallbackURL,
  enableProof     : true,
  profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name']
}, facebookLogin.bind(null, "realtor"));

exports.homeownerFacebookLogin = new FacebookStrategy({
  clientID        : config_auth.facebookAuth.clientID,
  clientSecret    : config_auth.facebookAuth.clientSecret,
  callbackURL     : config_auth.facebookAuth.realtorCallbackURL,
  enableProof     : true,
  profileFields: ['id', 'displayName', 'email', 'first_name', 'last_name', 'middle_name']
}, facebookLogin.bind(null, "homeowner"));
