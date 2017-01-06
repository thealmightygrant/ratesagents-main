var express = require('express')
,   router  = express.Router()
,   passport = require('passport')
,   csrf_protection = require('csurf')()
,   merge = require('lodash.merge')
,   conf = require('../config')
,   inputValidationWares = require('../middlewares/input_validation')
,   dashboardWares = require('../middlewares/dashboard')
,   utilWares = require('../middlewares/utils')


//external calls
//TODO: handle already registered user....
router.get('/auth/facebook'
           , passport.authenticate('homeowner-fb-login'
                                   , { scope : ['email'] }));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback'
           , passport.authenticate('homeowner-fb-login', {
             successRedirect : '/homeowners/dashboard',
             failureRedirect : '/homeowners/login'
           })
           , function(req, res) {
             console.log("Authenticated!!!")
             //TODO: info is in req.user[0].message
             res.redirect('/homeowners/dashboard')
           });


//TODO: add redirects from '/' to '/login' or '/dashboard' depending on login status
//NOTE: internal calls
//NOTE: anything below is protected from CSRF
router.use(csrf_protection
           , function(req, res, next){
             res.locals.model_name = 'homeowner';
             next();
           })

router.get('/register', function(req, res){
  //TODO: is there a better method for object merging?
  var prd = merge(res.locals
                  , conf.get('pages.homeowners-register')
                  , { data: { csrfToken: req.csrfToken() }})
  res.render('homeowner-register.hbs', prd);
});

router.post('/register'
            , function(req, res, next){
              res.locals.err_view = 'homeowner-register.hbs';
              next();
            }
            , inputValidationWares.validateRegister
            , utilWares.authMiddlewareFactory('homeowner-local-register',
                                               '/homeowners/register',
                                               '/homeowners/dashboard'))

router.get('/login', function(req, res){
  var prd = merge(res.locals
                  , conf.get('pages.homeowners-login')
                  , { data: { csrfToken: req.csrfToken() }})
  res.render('homeowner-login.hbs', prd);
});

router.post('/login'
            , function(req, res, next){
              res.locals.err_view = 'homeowner-login.hbs'
              next();
            }
            , inputValidationWares.validateLogin
            , utilWares.authMiddlewareFactory('homeowner-local-login',
                                               '/homeowners/login',
                                               '/homeowners/dashboard'))

//TODO: this should be a post
router.use('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
})

router.get('/dashboard'
           , inputValidationWares.isLoggedIn
           //TODO: add dashboard layout func
           , dashboardWares.determineDashboardLayout
           , function(req, res){
             var prd = merge(res.locals
                             , conf.get('pages.homeowners-dashboard-nav')
                             , conf.get('pages.homeowners-dashboard')
                             , res.locals.includeMap ? { data: { googleMaps: conf.get("apis.googleMaps") }} : {}
                             , { data: { csrfToken: req.csrfToken() }})
             res.render('homeowner-dashboard.hbs', prd);
           })

router.post('/basic-home-information'
            , inputValidationWares.isLoggedIn
            , function(req, res, next){
              res.locals.err_view = 'basic-home-information.hbs'
              res.locals.suc_url = '/homeowners/listing-commission-information'
              next();
            }
            , inputValidationWares.validateAndSaveHome)


router.post('/listing-commission-information'
            , inputValidationWares.isLoggedIn
            , function(req, res, next){
              res.locals.err_view = 'listing-commission-information.hbs'
              res.locals.suc_url = '/homeowners/start-auction'
              next();
            }
            , inputValidationWares.validateAndSaveHome)

module.exports = router;
