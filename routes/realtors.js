var express = require('express')
,   router  = express.Router()
,   passport = require('passport')
,   csrf_protection = require('csurf')()
,   merge = require('lodash.merge')
,   conf = require('../config')
,   inputValidationWares = require('../middlewares/input_validation')
,   utilWares = require('../middlewares/utils')

// //TODO: add location to scope
// router.get('/auth/facebook'
//            , passport.authenticate('realtor-fb-login'
//                                    , { session: false
//                                        , scope : ['email']}));

// // handle the callback after facebook has authenticated the user
// router.get('/auth/facebook/callback'
//            , passport.authenticate('realtor-fb-login', {
//              failureRedirect : '/realtors/login'
//            })
//            , function(req, res) {
//              //TODO: add flash message for fb login/registration
//              res.redirect('/realtors/dashboard')
//            });


//TODO: add redirects from '/' to '/login' or '/dashboard' depending on login status
//NOTE: internal calls
//NOTE: anything below is protected from CSRF
//QUESTION: move above fb calls?
router.use(csrf_protection
           , function(req, res, next){
             res.locals.model_name = 'realtor';
             next();
           })

router.get('/register', function(req, res){
  //TODO: is there a better method for object merging?
  var prd = merge(res.locals
                  , conf.get('pages.realtors-register')
                  , { data: { csrfToken: req.csrfToken() }})
  res.render('realtor-register.hbs', prd);
});

router.post('/register'
            , function(req, res, next){
              res.locals.err_view = 'realtor-register';
              next();
            }
            , inputValidationWares.validateRegister
            , passport.authenticate('realtor-local-register',
                                    { successRedirect: '/realtors/dashboard',
                                      failureRedirect: '/realtors/register',
                                      //TODO: failureFlash still needed?
                                      failureFlash: true }));

router.get('/login', function(req, res){
  var prd = merge(res.locals
                  , conf.get('pages.realtors-login')
                  , { data: { csrfToken: req.csrfToken() }})
  res.render('realtor-login.hbs', prd);
});

router.post('/login'
            , function(req, res, next){
              res.locals.err_view = 'realtor-login.hbs'
              next();
            }
            , inputValidationWares.validateLogin
            , utilWares.authMiddlewareFactory('realtor-local-login',
                                               '/realtors/login',
                                               '/realtors/dashboard'))

//TODO: this should be a post
router.use('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
})
//TODO: this should be a post
router.use('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
})

router.get('/dashboard'
           , inputValidationWares.isLoggedIn
           , function(req, res){ res.render('realtor-dashboard'); })


router.get('/profile/edit'
           , inputValidationWares.isLoggedIn
           , function(req, res){
             var prd = merge(res.locals
                             , conf.get('pages.realtor-profile')
                             , { data: { csrfToken: req.csrfToken() }}
                            )
             res.render('listing-commission-information.hbs', prd);
           })

router.get('/profile/view'
           , inputValidationWares.isLoggedIn
           , function(req, res){
             var prd = merge(res.locals
                             , conf.get('pages.realtor-profile'))
             res.render('listing-commission-information.hbs', prd);
           })



module.exports = router;
