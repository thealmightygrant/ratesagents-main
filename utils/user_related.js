var ra_utils = require('./utils')
,   data_promises = require('./data_promises')
,   Promise = require("bluebird")
,   conf = require("../config")
,   merge = require('lodash.merge')
,   models = require('../models/index')

var default_err_msgs = {
  first_name: {
    empty: 'Your first name can\'t be empty. What would we call you?'
  }
  , last_name: {
    empty: 'Your last name can\'t be empty. How would we stalk you?'
  }
  , email: {
    empty: 'Please tell us your email :D'
    , fake: 'Your email doesn\'t look right, can you please try again?'
    , in_use: 'Sorry, but that email has already been used to sign up.'
  }
  , username: {
    empty: 'Please give us your username :D'
    , is_weird: 'Sorry, but your username needs to contain only numbers, letters, dashes, and underscores.'
    , in_use: 'Sorry, but that username is already in use. Please select another one.'
  }
  , password: {
    empty: 'Please tell us your password. Don\'t keep us waiting.'
    , strong: 'Your password is too weak, please try adding some symbols or making it longer.'
  }
  , address: {
    empty: 'Please add an address.'
  }
  , street_number: {
    empty: 'Sorry, we need the full address.'
  }
  , standard: {
    empty: 'Sorry, but this can\'t be empty.'
  }
}

function retrieveErrorMsgs(desired_atts, des_err_msgs){
  var att, msg;
  var err_msgs = {};

  desired_atts.forEach(function(att){
    err_msgs[att] = {}
  });

  if(typeof(des_err_msgs) !== 'undefined')
  {
    for (att in des_err_msgs) { err_msgs[att] = des_err_msgs[att]; }
  }

  for(att in default_err_msgs){
    for(msg in default_err_msgs[att]){
      if(err_msgs[att] && !err_msgs[att][msg])
        err_msgs[att][msg] = default_err_msgs[att][msg];
    }
  }

  return err_msgs;
}

function arrangeValidationErrors(errors){
  var updatedErrors = {};
  errors.forEach(function(val, idx, arr){
    updatedErrors[val.param] = val.msg;
  })
  return updatedErrors;
}

exports.validateRegister = function(req, res, next){

  var name = req.body.name
  ,   email = req.body.email
  ,   first_name = req.body.first_name
  ,   last_name = req.body.last_name
  ,   password = req.body.password
  ,   options = typeof(res.locals) !== 'undefined' ? res.locals : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'realtor-login.hbs'
  ,   model_name = typeof(options.model_name) === 'string' ? options.model_name : "realtor"

  var err_msgs = retrieveErrorMsgs(['first_name', 'last_name', 'email', 'password'])

  //validators
  req.checkBody('first_name', err_msgs.first_name.empty ).notEmpty();
  req.checkBody('last_name', err_msgs.last_name.empty ).notEmpty();
  req.checkBody('email', err_msgs.email.empty ).notEmpty();
  req.checkBody('password', err_msgs.password.empty ).notEmpty();

  //sanitizers
  req.sanitizeBody('email').normalizeEmail();

  if(!req.validationErrors()){
    //TODO: restrict password to certain characters?
    req.checkBody('email', err_msgs.email.fake ).isEmail();
  }

  if(!req.validationErrors()) {
    req.checkBody('email', err_msgs.email.in_use).isEmailAvailable(model_name);
  }

  req.asyncValidationErrors()
    .then(function() {
      next()
    })
    .catch(function(errors) {
      res.render(err_view, {
        data: {
          first_name: first_name,
          last_name: last_name,
          email: email,
          csrfToken: req.body._csrf
        }, messages: arrangeValidationErrors(errors)
      })
    });
}

exports.validateLogin = function(req, res, next){
  var email = req.body.email
  ,   password = req.body.password
  ,   options = typeof(res.locals) !== 'undefined' ? res.locals : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'realtor-login.hbs'
  ,   err_msgs = retrieveErrorMsgs(['email', 'password']);

  //TODO: redirect to dashboard or something if already logged in, mayyybe

  req.checkBody('email', err_msgs.email.empty ).notEmpty();
  req.checkBody('password', err_msgs.password.empty ).notEmpty();

  if(req.validationErrors())
  {
    res.render(err_view, {
      data: {
        email: email,
        csrfToken: req.body._csrf
      }, messages: arrangeValidationErrors(req.validationErrors())
    })
  }
  else
  {
    next();
  }
}

exports.validateAndSaveAddress = function(req, res){

  var home_type = req.body.home_type
  ,   num_bedrooms = req.body.num_bedrooms
  ,   num_bathrooms = req.body.num_bathrooms
  ,   street_number = req.body.street_number
  ,   address = req.body.address
  ,   route = req.body.route
  ,   neighborhood = req.body.neighborhood
  ,   city = req.body.city
  ,   county = req.body.county
  ,   state = req.body.state
  ,   zipcode = req.body.zipcode
  ,   options = typeof(res.locals) !== 'undefined' ? res.locals : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'basic-home-information.hbs'
  ,   suc_view = typeof(options.suc_view) === 'string' ? options.suc_view : 'advanced-home-information.hbs'
  ,   model_name = typeof(options.model_name) === 'string' ? options.model_name : "homeowner"

  var err_msgs = retrieveErrorMsgs(['address', 'home_type', 'street_number', 'standard'])
  var messages;


  //validators
  req.checkBody('street_number', err_msgs.street_number.empty ).notEmpty();
  //TODO: map street address to address if the error exists
  req.checkBody('address', err_msgs.address.empty ).notEmpty();

  if(address &&
     (!route ||
      !city ||
      !county ||
      !state ||
      !zipcode)){
    //add an option to skip address input
    messages = {address: "Please try searching your address again."}
  }

  var errViewData = {
    googleMaps: conf.get("apis.googleMaps"),
    home_type: home_type,
    num_bedrooms: num_bedrooms,
    num_bathrooms: num_bathrooms,
    address: address,
    neighborhood: neighborhood,
    street_number: street_number,
    route: route,
    city: city,
    county: county,
    state: state,
    zipcode: zipcode,
    csrfToken: req.body._csrf
  };

  //TODO: write to DB
  if(req.validationErrors() || messages){
    res.render(err_view, {
      includeMap: true,
      data: errViewData,
      messages: merge(arrangeValidationErrors(req.validationErrors()), messages)
    })
  }
  else {
    models["home"].create({
      homeType: home_type,
      numBedrooms: num_bedrooms,
      numBathrooms: num_bathrooms,
      streetNumber: street_number,
      route: route,
      neighborhood: neighborhood,
      city: city,
      county: county,
      state: state,
      zipcode: zipcode
    }).then(function(home){
      return models["listing"].create({
        homeId: home.id,
        homeownerId: req.session.passport.user.id
      })
    }).then(function(listing){
      res.render(suc_view);
    }).catch(function(e){
      res.render(err_view, {
        includeMap: true,
        data: errViewData,
        messages: merge(arrangeValidationErrors(req.validationErrors()), messages)
      })
    })
  }
}

exports.validateAndSaveHomeDetails = function(req, res){

}

exports.isLoggedIn = function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    res.locals.user = {
      name: req.user.name
      , userType: req.user.userType
      , username: req.user.username
      , email: req.user.email
    }
    return next();
  }
  return res.redirect('/');
}
