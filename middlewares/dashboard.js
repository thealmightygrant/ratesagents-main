const conf = require("../config")
,     modelPromises = require('../utils/model_promises')
,     validators = require('../utils/validators')
,     merge = require('lodash.merge')

module.exports = {
  determineDashboardLayout: determineDashboardLayout,
  addIncludes: addIncludes,
  renderData: renderData
}

function determineDashboardLayout(req, res, next) {
  //TODO: Add another row of tabs to let you select which listingInputStep to go to.
  //NOTE: Add the info in the query string and parse from there.

  //address-and-home-type check
  modelPromises.retrieveListings(req.session.passport.user.id,
                                 req.session.passport.user.userType,
                                 { limit: 10, order: '"updatedAt" DESC'})

    .then(function(listings){
      const mostRecentListing = listings.length ? listings[0] : null;
      //no listings exist
      if(!mostRecentListing){
        res.locals.listingInputStep = 'address-and-home-type'
        return Promise.reject("no recent listing");
      }
      return mostRecentListing;
    }).then(function(mostRecentListing){
      return modelPromises.retrieveHomeViaId(mostRecentListing.homeId);
    }).then(function(mostRecentHome){
      const mostRecentHomeAddress = mostRecentHome && validators.isValidAddress(mostRecentHome) ? constructHomeAddress(mostRecentHome) : null;
      console.log("home: ", mostRecentHome)
      console.log("address: ", mostRecentHomeAddress)
      if(!mostRecentHome || !mostRecentHomeAddress){
        res.locals.listingInputStep = 'address-and-home-type'
        return Promise.reject("no recent home");
      }

      if(!res.locals.data){
        res.locals.data = {}
      }

      res.locals.data.home = mostRecentHome;
      res.locals.data.home.address = mostRecentHomeAddress;
    }).finally(function(){
      next();
    })

  //listing-price-and-commission check

}

function constructHomeAddress(home){
  return home.streetNumber + " " +
    home.route + ", " +
    home.city + ", " +
    home.state + ", United States";
}

function addIncludes(req, res, next) {
  switch(res.locals.listingInputStep){
  case 'address-and-home-type':
    res.locals.includeMap = true;
    break;
  case 'listing-price-and-commission':
    res.locals.includeChart = true;
    break;
  }
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
