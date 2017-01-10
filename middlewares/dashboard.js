const conf = require("../config")
,     Promise = require("bluebird")
,     modelPromises = require('../utils/model_promises')
,     validators = require('../utils/validators')
,     merge = require('lodash.merge')
,     cloneDeep = require('lodash.clonedeep')

module.exports = {
  determineDashboardLayout: determineDashboardLayout,
  addIncludes: addIncludes,
  renderData: renderData
}

function sequelizeCloneCB (value) {
  // specially for the sequelize instances
  if (value && value.toJSON) {
    return value.toJSON();
  }
}

function retrieveDataFromSession(session, model_name){
  return new Promise(function(resolve, reject){
    if(session && session[model_name]){
      resolve(session[model_name]);
    }
    else {
      reject(new Error("NoSessionListing"));
    }
  })
}

function retrieveListingFromDB(user_id, userType){
  return modelPromises.retrieveListings(user_id, userType,
                                        { limit: 10, order: '"updatedAt" DESC'})
    .then(function(listings){
      const mostRecentListing = listings.length ? listings[0] : null;
      //no listings exist
      if(!mostRecentListing){
        return Promise.reject(new Error("NoRecentListing"));
      }

      return mostRecentListing;
    })
}

function retrieveHomeFromDB(listing){
  if(!listing.homeId)
    return Promise.reject(new Error("NoDesiredCommission"));

  return modelPromises.retrieveItemViaId(listing.homeId, "home").then(function(home){
    if(!home){
      return Promise.reject(new Error("NoRecentHome"))
    }
    return home;
  })
}

function retrieveDesiredCommissionFromDB(listing){
  if(!listing.desiredCommissionId){
    return Promise.reject(new Error("NoDesiredCommission"));
  }

  return modelPromises.retrieveItemViaId(listing.desiredCommissionId, "commission").then(function(commission){
    if(!commission){
      return Promise.reject(new Error("NoDesiredCommission"))
    }
    return commission;
  })
}

function determineDashboardLayout(req, res, next) {
  const sessionData = req.session.data;
  const localData = res.locals.data;

  //TODO: Add another row of tabs to let you select which listingInputStep to go to.
  //NOTE: Add the info in the query string and parse from there.

  //NOTE: session info could be stale, look into caching so we don't hit db every time though
  //address-and-home-type check

  const listingPromise = //Promise.any(
          //[
          //retrieveDataFromSession(req.session, "listing"),
          retrieveListingFromDB(req.session.passport.user.id,
                                req.session.passport.user.userType)
          //])
          .then(function(mostRecentListing){
            if(!sessionData.listing)
              sessionData.listing = mostRecentListing;
            localData.listing = mostRecentListing;
            return mostRecentListing;
          }).catch(function(e){
            if((e.message === "NoSessionListing") ||
               (e.message === "NoRecentListing"))
              res.locals.listingInputStep = 'address-and-home-type'
            else
              throw e;
          })

  const homePromise = //Promise.any(
          //[
          //retrieveDataFromSession(req.session, "home"),
          listingPromise.then(retrieveHomeFromDB)
          //])
          .then(function(home){
            if(!sessionData.home){
              sessionData.home = home;
            }
            localData.home = home;

            const mostRecentHomeAddress = (home && validators.isValidAddress(home)) ? constructHomeAddress(home) : null;
            if(!mostRecentHomeAddress){
              return Promise.reject(new Error("NoRecentHomeAddress"));
            }

            if(!sessionData.home.address)
              sessionData.home.address = mostRecentHomeAddress;
            localData.home.address = mostRecentHomeAddress;

            return home;
          }).catch(function(e){
            if((e.message === "NoRecentHome") ||
               (e.message === "NoRecentHomeAddress"))
              res.locals.listingInputStep = 'address-and-home-type'
            else
              throw e;
          })

  const desiredCommissionPromise = //Promise.any(
          //[
          //retrieveDataFromSession(req.session, "desiredCommission"),
            listingPromise.then(retrieveDesiredCommissionFromDB)
          //])
          .then(function(desiredCommission){
            if(!sessionData.desiredCommission){
              //TODO: check into deep cloning here and in model.js
              sessionData.desiredCommission = desiredCommission;
            }
            localData.desiredCommission = desiredCommission;

            return desiredCommission;
          }).catch(function(e){
            if(e.message === "NoDesiredCommission"){
              res.locals.listingInputStep = 'listing-price-and-commission'
            }
            else{
              throw e;
            }
          })

  //TODO: add sale data promise here

  Promise.all([
    homePromise,
    desiredCommissionPromise
  ]).finally(function(){
    // if(req.query &&
    //    req.query["listing-input-step"]){
    //   res.locals.listingInputStep = req.query["listing-input-step"];
    // }
    if(!res.locals.listingInputStep)
      res.locals.listingInputStep = "auction";
    res.locals.activeTab = res.locals.listingInputStep;
    next();
  })
}

function constructHomeAddress(home){
  return home.streetNumber + " " +
    home.route + ", " +
    home.city + ", " +
    home.state + ", United States";
}

function addIncludes(req, res, next) {
  res.locals.includeMap = true;
  res.locals.includeChart = true;
  return next();
}

function renderData(req, res){
  var prd = merge(res.locals
                  , conf.get('pages.homeowners-dashboard-nav')
                  , conf.get('pages.homeowners-dashboard')
                  , res.locals.includeMap ? { data: { googleMaps: conf.get("apis.googleMaps") }} : {}
                  , { data: { csrfToken: req.csrfToken() }})
  res.render('homeowner-dashboard.hbs', prd);
}
