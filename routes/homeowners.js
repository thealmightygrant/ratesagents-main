var express = require('express')
,   passport = require('passport')
,   router  = express.Router()
,   data_promises = require('../utils/data_promises')
,   user_utils = require('../utils/user_related')
,   middleware = require('../utils/middleware')
,   conf = require('../config')
,   csrf_protection = require('csurf')()
,   merge = require('lodash.merge')

// //external calls
// //TODO: add location to scope
// router.get('/auth/facebook'
//            , passport.authenticate('homeowner-fb-login'
//                                    , { session: false
//                                        , scope : ['email']}));

// // handle the callback after facebook has authenticated the user
// router.get('/auth/facebook/callback'
//            , passport.authenticate('homeowner-fb-login', {
//              failureRedirect : '/homeowners/login'
//            })
//            , function(req, res) {
//              //TODO: info is in req.user[0].message
//              res.redirect('/homeowners/dashboard')
//            });


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
            , user_utils.validateRegister
            , middleware.authMiddlewareFactory('homeowner-local-register',
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
            , user_utils.validateLogin
            , middleware.authMiddlewareFactory('homeowner-local-login',
                                               '/homeowners/login',
                                               '/homeowners/dashboard'))

//TODO: this should be a post
router.use('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
})

router.use('/'
           , user_utils.isLoggedIn
           , function(req, res){
             var prd = merge(res.locals
                             , conf.get('pages.homeowners-dashboard-nav')
                             , conf.get('pages.homeowners-dashboard')
                             , { data: { csrfToken: req.csrfToken() }})
             res.render('homeowner-dashboard.hbs', prd);
           })

module.exports = router;
