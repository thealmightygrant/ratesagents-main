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
  if(!listing || !listing.homeId)
    return Promise.reject(new Error("NoDesiredCommission"));

  return modelPromises.retrieveItemViaId(listing.homeId, "home").then(function(home){
    if(!home){
      return Promise.reject(new Error("NoRecentHome"))
    }
    return home;
  })
}

function retrieveDesiredCommissionFromDB(listing){
  if(!listing || !listing.desiredCommissionId){
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

  //NOTE: Add the info in the query string and parse from there.
  //NOTE: session info could be stale, look into caching so we don't hit db every time though
  //address-and-home-type check

  const listingPromise = retrieveListingFromDB(req.session.passport.user.id,
                                req.session.passport.user.userType)
          .then(function(mostRecentListing){
            if(!mostRecentListing){
              return Promise.reject(new Error("NoRecentListing"))
            }
            sessionData.listing = cloneDeep(mostRecentListing.dataValues);
            localData.listing = mostRecentListing.dataValues;
            return mostRecentListing;
          }).catch(function(e){
            if(e.message === "NoRecentListing")
              res.locals.listingInputStep = 'address-and-home-type'
            throw e;
          })

  const homePromise = listingPromise.then(retrieveHomeFromDB)
          .then(function(home){
            sessionData.home = cloneDeep(home.dataValues);
            localData.home = home.dataValues;

            const mostRecentHomeAddress = (home && validators.isValidAddress(home)) ? constructHomeAddress(home) : null;
            if(!mostRecentHomeAddress){
              return Promise.reject(new Error("NoRecentHomeAddress"));
            }

            sessionData.home.address = mostRecentHomeAddress;
            localData.home.address = mostRecentHomeAddress;

            return home;
          }).catch(function(e){
            throw e;
          })

  const desiredCommissionPromise = listingPromise.then(retrieveDesiredCommissionFromDB)
          .then(function(desiredCommission){
            if(!desiredCommission){
              return Promise.reject(new Error("NoDesiredCommission"));
            }
            sessionData.desiredCommission = cloneDeep(desiredCommission.dataValues);
            localData.desiredCommission = desiredCommission.dataValues;

            return desiredCommission;
          }).catch(function(e){
            throw e;
          })

  const closingDatePromise = listingPromise
          .then(function(mostRecentListing){
            if(mostRecentListing &&
               (!mostRecentListing.closingDate ||
                !mostRecentListing.closingDateMax ||
                !mostRecentListing.closingDateMin)){
              return Promise.reject(new Error("NoClosingDate"));
            }
          }).catch(function(e){
            throw e;
          })

  const auctionPromise = listingPromise
          .then(function(mostRecentListing){
            if(mostRecentListing &&
               (!mostRecentListing.auctionStart ||
                !mostRecentListing.auctionEnd)){
              return Promise.reject(new Error("NoAuction"));
            }
          }).catch(function(e){
            throw e;
          })


  //TODO: add sale data promise here

  Promise.all([
    homePromise,
    desiredCommissionPromise,
    closingDatePromise,
    auctionPromise
  ]).catch(function(e){
    if((e.message !== "NoAuction") &&
       (e.message !== "NoClosingDate") &&
       (e.message !== "NoDesiredCommission") &&
       (e.message !== "NoRecentHome") &&
       (e.message !== "NoRecentHomeAddress") &&
       (e.message !== "NoRecentListing"))
      throw e;
    else {
      switch(e.message){
      case "NoRecentListing":
      case "NoRecentHomeAddress":
      case "NoRecentHome":
        res.locals.listingInputStep = "address-and-home-type"
        break;
      case "NoDesiredCommission":
        if(res.locals.listingInputStep !== "address-and-home-type"){
          res.locals.listingInputStep = "listing-price-and-commission"
        }
        break;
      case "NoClosingDate":
        if((res.locals.listingInputStep !== "address-and-home-type") &&
           (res.locals.listingInputStep !== "listing-price-and-commission")){
          res.locals.listingInputStep = "closing-date"
        }
        break;
      case "NoAuction":
        if((res.locals.listingInputStep !== "address-and-home-type") &&
           (res.locals.listingInputStep !== "listing-price-and-commission") &&
           (res.locals.listingInputStep !== "closing-date")){
          res.locals.listingInputStep = "auction";
        }
        break;
      }
    }
  }).finally(function(){
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
