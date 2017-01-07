const models = require('../models/index')
,     merge = require('lodash.merge')
,     modelPromises = require('../utils/model_promises')

module.exports = {
  saveHome: saveHome
}

const dbErrorMsg = {mainError: "There has been a database issue. Please wait a few seconds and try submitting your info again. Thanks! "}

function saveHome(req, res, next){
  const rb = req.body;
  const err_view = res.locals.err_view;

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

  if(rb.homeId){
    modelPromises.updateModel(homeData, rb.homeId, "home")
    return next();
  }

  models["home"].create(homeData)
    .then(function(home){
      req.session.home = {id: home.id}
      return models["listing"].create({
        homeId: home.id,
        homeownerId: req.session.passport.user.id
      })
    }).catch(function(e){
      console.error("error: ", e)
      res.render(err_view,
                 merge(res.locals, {
                   data: { home: homeData,
                           csrfToken: req.body._csrf },
                   messages: dbErrorMsg
                 }))
    })
}
