const conf = require("../config")
,   merge = require('lodash.merge')
,   models = require('../models/index')
,   Promise = require("bluebird")

module.exports = {
  validateRegister: validateRegister,
  validateLogin: validateLogin,
  validateHome: validateHome,
  validateDesiredCommission: validateDesiredCommission,
  isLoggedIn: isLoggedIn
}

const default_err_msgs = {
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
    , wholeNumber: "Sorry, but this needs to be a whole number."
    , number: "Sorry, but this needs to be a number."
  }
}

function arrangeValidationErrors(errors){
  const updatedErrors = {};
  errors.forEach(function(val){
    updatedErrors[val.param] = val.msg;
  })
  return updatedErrors;
}

function validateRegister(req, res, next){

  const email = req.body.email
  ,   first_name = req.body.first_name
  ,   last_name = req.body.last_name
  ,   options = typeof(res.locals) !== 'undefined' ? res.locals : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'realtor-login.hbs'
  ,   model_name = typeof(options.model_name) === 'string' ? options.model_name : "realtor"

  //validators
  req.checkBody('first_name', default_err_msgs.first_name.empty ).notEmpty();
  req.checkBody('last_name', default_err_msgs.last_name.empty ).notEmpty();
  req.checkBody('email', default_err_msgs.email.empty ).notEmpty();
  req.checkBody('password', default_err_msgs.password.empty ).notEmpty();

//TODO: remove when openned to public
  req.checkBody('email', "Sorry, but only the founders have accounts for now." ).isInternalEmail()

  //sanitizers
  req.sanitizeBody('email').normalizeEmail();

  if(!req.validationErrors()){
    //TODO: restrict password to certain characters?
    req.checkBody('email', default_err_msgs.email.fake ).isEmail();
  }

  if(!req.validationErrors()) {
    req.checkBody('email', default_err_msgs.email.in_use).isEmailAvailable(model_name);
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

function validateLogin(req, res, next){
  const email = req.body.email
  ,   options = typeof(res.locals) !== 'undefined' ? res.locals : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'realtor-login.hbs'

  //TODO: redirect to dashboard or something if already logged in, mayyybe

  req.checkBody('email', default_err_msgs.email.empty ).notEmpty();
  req.checkBody('password', default_err_msgs.password.empty ).notEmpty();

  //TODO: remove when openned to public
  req.checkBody('email', "Sorry, but only the founders can login for now." ).isInternalEmail()

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

function validateHome(req, res, next){

  const rb = req.body;
  let messages = null;

  req.checkBody('streetNumber', default_err_msgs.street_number.empty ).notEmpty().isInt();
  req.checkBody('homeSize',  default_err_msgs.standard.empty ).notEmpty();
  req.checkBody('homeSize',  default_err_msgs.standard.wholeNumber ).isInt();
  req.checkBody('address', default_err_msgs.address.empty ).notEmpty();

  if(rb.address &&
     (!rb.route ||
      !rb.city ||
      !rb.county ||
      !rb.state ||
      !rb.zipcode)){
    //add an option to skip address input
    messages = {address: "Please try searching your address again."}
  }

  if(req.validationErrors() || messages){
    req.session.data.home = merge(req.session.data.home || {}, {
      homeType: rb.homeType,
      homeSize: rb.homeSize,
      secondaryDescriptor: rb.secondaryDescriptor,
      secondaryDesignator: rb.secondaryDesignator,
      address: rb.address,
      streetNumber: rb.streetNumber,
      route: rb.route,
      neighborhood: rb.neighborhood,
      city: rb.city,
      county: rb.county,
      state: rb.state,
      zipcode: rb.zipcode
    })
    req.session.messages = merge(arrangeValidationErrors(req.validationErrors()), messages)
  }
  else {
    next()
  }
}

function validateDesiredCommission(req, res, next){
  const rb = req.body;

  req.checkBody('buyPrice',  default_err_msgs.standard.empty ).notEmpty();
  req.checkBody('buyPrice',  default_err_msgs.standard.number ).isFloat();
  req.checkBody('price',  default_err_msgs.standard.empty ).notEmpty();
  req.checkBody('price',  default_err_msgs.standard.number ).isFloat();
  req.checkBody('flatFee',  default_err_msgs.standard.empty ).notEmpty();
  req.checkBody('flatFee',  default_err_msgs.standard.number ).isFloat();
  req.checkBody('tier0Commission',  default_err_msgs.standard.empty ).notEmpty();
  req.checkBody('tier0Commission',  default_err_msgs.standard.number ).isFloat();

  if(req.validationErrors()){
    req.session.data.desiredCommission = merge(req.session.data.desiredCommission || {}, {
      flatFee: rb.flatFee,
      tier0Commission: rb.tier0Commission
    })

    req.session.data.listing = merge(req.session.data.listing || {}, {
      buyPrice: rb.buyPrice,
      price: rb.price
    })

    req.session.messages = arrangeValidationErrors(req.validationErrors());
    res.redirect('/homeowners/dashboard')
  }
  else {
    next()
  }
}


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()){
    res.locals.user = {
      name: req.user.name
      , userType: req.user.userType
      , username: req.user.username
      , email: req.user.email
    }
    return next();
  }
  return res.redirect('/sign-in');
}
