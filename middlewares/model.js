const models = require('../models/index')
,     conf = require("../config")
,     merge = require('lodash.merge')
,     cloneDeep = require('lodash.clonedeep')
,     modelPromises = require('../utils/model_promises')

module.exports = {
  saveHome: saveHome,
  saveDesiredCommission: saveDesiredCommission,
  saveClosingDate: saveClosingDate
}

const dbErrorMsg = {mainError: "There has been a database issue. Please wait a few seconds and try submitting your info again. Thanks! "}

function sequelizeCloneCB (value) {
  // specially for the sequelize instances
  if (value && value.toJSON) {
    return value.toJSON();
  }
}

function saveHome(req, res, next){
  const sessionData = req.session.data;
  const rb = req.body;

  const homeData = {
    homeType: rb.homeType,
    homeSize: rb.homeSize,
    streetNumber: rb.streetNumber,
    route: rb.route,
    neighborhood: rb.neighborhood,
    city: rb.city,
    county: rb.county,
    state: rb.state,
    zipcode: rb.zipcode,
    secondaryDesignator: rb.secondaryDesignator,
    secondaryDescriptor: rb.secondaryDescriptor
  }

  if(req.session.data.home && req.session.data.home.id){
    modelPromises.updateModel(homeData, req.session.data.home.id, "home")
    return next();
  }

  const homeCreator = function(){
    if(sessionData.home && sessionData.home.id){
      return modelPromises.updateModel(homeData, sessionData.home.id, "home")
    }
    else {
      return models["home"].create(homeData);
    }
  }

  const listingCreator = function(home){
    if(sessionData.listing && sessionData.listing.id){
      modelPromises.updateModel({ homeId: home.id }, req.session.data.listing.id, "listing")
      return next()
    }
    else {
      return models["listing"].create({
        homeId: home.id,
        homeownerId: req.session.passport.user.id
      })
    }
  }

  homeCreator()
    .then(function(home){
      sessionData.home = cloneDeep(home.dateValues);
      sessionData.home.address = rb.address;
      return home;
    })
    .then(listingCreator)
    .then(function(listing){
      sessionData.listing = merge(sessionData.listing || {}, listing.dataValues)
    })
    .catch(function(e){
      sessionData.home = merge(req.session.data.home || {}, homeData)
      sessionData.home.address = rb.address;
      res.locals.messages = dbErrorMsg;
      res.redirect('/homeowners/dashboard')
    })
}

function saveDesiredCommission(req, res, next){
  const sessionData = req.session.data;
  const rb = req.body;

  const desiredCommissionData = {
    flatFee: rb.flatFee,
    tier0Commission: rb.tier0Commission
  }

  const listingDataWithoutCommission = {
    buyPrice: rb.buyPrice,
    price: rb.price
  }

  let commissionSaver;

  if(sessionData.desiredCommission && sessionData.desiredCommission.id){
    commissionSaver = modelPromises.updateModel(desiredCommissionData, sessionData.desiredCommission.id, "commission")
  }
  else {
    commissionSaver = models["commission"].create(desiredCommissionData);
  }

  const listingUpdater = function(commission){
    const listingData = merge({desiredCommissionId: commission.id}, listingDataWithoutCommission);

    if(sessionData.listing && sessionData.listing.id){
      return modelPromises.updateModel(listingData, sessionData.listing.id, "listing")
    }
    else {
      return models["listing"].create(listingData)
    }
  }

  commissionSaver
    .then(function(commission){
      sessionData.commission = merge(sessionData.commission || {}, commission.dataValues)
      return commission;
    })
    .then(listingUpdater)
    .then(function(listing){
      sessionData.listing = merge(sessionData.listing || {}, listing.dataValues);
      return next();
    }).catch(function(e){
      sessionData.listing = merge(sessionData.listing || {}, listingDataWithoutCommission)
      sessionData.commission = merge(sessionData.commission || {}, desiredCommissionData)
      res.locals.messages = dbErrorMsg;
      res.redirect('/homeowners/dashboard')
    })
}

function saveClosingDate(req, res, next){
  const sessionData = req.session.data;
  const rb = req.body;

  const listingData = {
    closingDate: rb.closingDate,
    closingDateMin: rb.closingDateMin,
    closingDateMax: rb.closingDateMax
  }

  const listingUpdater = function(){
    if(sessionData.listing && sessionData.listing.id){
      return modelPromises.updateModel(listingData, sessionData.listing.id, "listing")
    }
    else {
      return models["listing"].create(listingData)
    }
  }

  listingUpdater()
    .then(function(listing){
      sessionData.listing = merge(sessionData.listing || {}, listing.dataValues);
      return next();
    }).catch(function(e){
      sessionData.listing = merge(sessionData.listing || {}, listingData)
      res.locals.messages = dbErrorMsg;
      res.redirect('/homeowners/dashboard')
    })
}
