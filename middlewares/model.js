const models = require('../models/index')
,     conf = require("../config")
,     merge = require('lodash.merge')
,     cloneDeep = require('lodash.clonedeep')
,     modelPromises = require('../utils/model_promises')

module.exports = {
  saveHome: saveHome,
  saveDesiredCommission: saveDesiredCommission
}

const dbErrorMsg = {mainError: "There has been a database issue. Please wait a few seconds and try submitting your info again. Thanks! "}

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

  const homeCreator = models["home"].create(homeData);

  const listingCreator = function(home){
    sessionData.home = home;
    sessionData.home.address = rb.address;
    if(req.session.data.listing && req.session.data.listing.id){
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

  homeCreator
    .then(listingCreator)
    .then(function(listing){
      sessionData.listing = listing;
      return next();
    }).catch(function(e){
      sessionData.home = merge(req.session.data.home || {}, homeData)
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

  //TODO: add update for commission based on session
  const commissionCreator = models["commission"].create(desiredCommissionData);
  const listingUpdater = function(commission){
    const listingData = {
      buyPrice: rb.buyPrice,
      price: rb.price,
      desiredCommissionId: commission.id
    }

    if(sessionData.listing && sessionData.listing.id){
      return modelPromises.updateModel(listingData, sessionData.listing.id, "listing")
    }

    sessionData.desiredCommission = commission;
  }

  commissionCreator
    .then(listingUpdater)
    .then(function(listing){
      sessionData.listing = listing;
      return next();
    }).catch(function(e){
      sessionData.listing = merge(sessionData.listing || {}, {
        buyPrice: rb.buyPrice,
        price: rb.price
      })
      sessionData.commission = merge(sessionData.commission || {},
                                     desiredCommissionData)
      res.locals.messages = dbErrorMsg;
      res.redirect('/homeowners/dashboard')
    })
}
