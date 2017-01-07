const conf = require("../config")
,   merge = require('lodash.merge')
,   models = require('../models/index')
,   Promise = require("bluebird")

module.exports = {
  validateRegister: validateRegister,
  validateLogin: validateLogin,
  validateHome: validateHome,
  validateAndSaveHomeDetails: validateAndSaveHomeDetails,
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
    , number: "Sorry, but this needs to be a whole number."
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

  const homeId = req.body.homeId
  ,     homeType = req.body.homeType
  ,     homeSize = req.body.homeSize
  ,     secondaryDescriptor = req.body.secondaryDescriptor
  ,     secondaryDesignator = req.body.secondaryDesignator
  ,     streetNumber = req.body.streetNumber
  ,     address = req.body.address
  ,     route = req.body.route
  ,     neighborhood = req.body.neighborhood
  ,     city = req.body.city
  ,     county = req.body.county
  ,     state = req.body.state
  ,     zipcode = req.body.zipcode
  ,     err_view = res.locals.err_view || 'homeowner-dashboard.hbs'

  let messages = null;

  req.checkBody('streetNumber', default_err_msgs.street_number.empty ).notEmpty().isInt();
  req.checkBody('homeSize',  default_err_msgs.standard.empty ).notEmpty();
  req.checkBody('homeSize',  default_err_msgs.standard.number ).isInt();
  req.checkBody('address', default_err_msgs.address.empty ).notEmpty();

  if(address &&
     (!route ||
      !city ||
      !county ||
      !state ||
      !zipcode)){
    //add an option to skip address input
    messages = {address: "Please try searching your address again."}
  }

  const errViewData = {
    googleMaps: conf.get("apis.googleMaps"),
    homeSize: homeSize,
    homeType: homeType,
    address: address,
    neighborhood: neighborhood,
    streetNumber: streetNumber,
    route: route,
    city: city,
    county: county,
    state: state,
    zipcode: zipcode,
    secondaryDescriptor: secondaryDescriptor,
    secondaryDesignator: secondaryDesignator,
    homeId: homeId
  };

  if(req.validationErrors() || messages){
    res.render(err_view,
               merge(res.locals, {
                 listingInputStep: 'address-and-home-type',
                 includeMap: true,
                 data: { home: errViewData,
                         googleMaps: conf.get("apis.googleMaps"),
                         csrfToken: req.body._csrf },
                 messages: merge(arrangeValidationErrors(req.validationErrors()), messages)
               }))
  }
  else {
    next()
  }
}

function validateAndSaveHomeDetails(req, res){
  //NOTE: for each detail, create a new homeowner detail
  const options = typeof(res.locals) !== 'undefined' ? res.locals : {}
  ,   err_view = typeof(options.err_view) === 'string' ? options.err_view : 'basic-home-information.hbs'
  ,   suc_url = typeof(options.suc_url) === 'string' ? options.suc_url : '/homeowners/advanced-home-information'
  ,   form_data = req.body
  ,   parsed_data = {}

  //HACK: materialize is only useful for this prototype :(
  Object.keys(form_data).forEach(function(key){
    const s = key.split('_');
    if(s[1] === 'csrf'){
      return;
    }
    else if(s[1] === 'size'){
      //numbers
      if(form_data[key]){
        parsed_data[s[0]] = parsed_data[s[0]] || {}
        parsed_data[s[0]]['size'] = form_data[key];
        //TODO: validate as numbers here
      }
    }
    else {
      //checkboxes onlyyyyy
      parsed_data[s[0]] = parsed_data[s[0]] || {}
      //NOTE: there's got to be a better way then space separated values...
      parsed_data[s[0]]['text'] = parsed_data[s[0]]['text'] ? parsed_data[s[0]]['text'] + s[1] + " " : s[1] + " "
    }
  })

  //TODO: find and update...or create
  //      can find in db based on name and home id
  //SEE: http://stackoverflow.com/questions/18304504/create-or-update-sequelize
  const modelsCreated = Object.keys(parsed_data).map(function(key){
    return models["homeDetail"].create({
      homeId: req.session.home.id,
      name: key,
      size: parsed_data[key]['size'] || "",
      features: parsed_data[key]['text'] || ""
    })
  })

  Promise.all(modelsCreated).then(function(){
    res.redirect(suc_url);
  }).catch(function(e){
    //TODO: redirect properly on database write
    console.error("error: ", e)
  })
}

function isLoggedIn(req, res, next) {
  console.log(req.session)
  if (req.isAuthenticated()){
    console.log("Logged in!!")
    res.locals.user = {
      name: req.user.name
      , userType: req.user.userType
      , username: req.user.username
      , email: req.user.email
    }
    return next();
  }
  else {
    console.log("Not Logged in!!")
  }
  return res.redirect('back');
}