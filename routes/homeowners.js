var express = require('express')
,   passport = require('passport')
,   router  = express.Router()
,   data_promises = require('../utils/data_promises')
,   user_utils = require('../utils/user_related')
,   csrf_protection = require('csurf')();

//external calls
//TODO: add location to scope
router.get('/auth/facebook'
           , passport.authenticate('homeowner-fb-login'
                                   , { session: false
                                       , scope : ['email']}));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback'
           , passport.authenticate('homeowner-fb-login', {
             failureRedirect : '/homeowners/login'
           })
           , function(req, res) {
             //TODO: add flash message for fb login/registration
             res.redirect('/homeowners/dashboard')
           });

//internal calls
//anything below protected from csrf
router.use(csrf_protection
           , function(req, res, next){
             res.locals.model_name = 'homeowner';
             next();
           })

router.get('/register', function(req, res){
  res.render('homeowner-register', { csrfToken: req.csrfToken() });
});

router.post('/register'
            , function(req, res, next){
              res.locals.err_view = 'homeowner-register';
              next();
            }
            , user_utils.validateRegister
            , passport.authenticate('homeowner-local-register')
            , function(req, res){
              res.redirect('/homeowners/dashboard');
            })

router.get('/login', function(req, res){
  res.render('homeowner-login', { csrfToken: req.csrfToken() });
});

router.post('/login'
            , function(req, res, next){
                res.locals.error_view = 'homeowner-login'
                next();
            }
            , user_utils.validateLogin
            , passport.authenticate('homeowner-local-login',
                                    { successRedirect: '/homeowners/dashboard',
                                      failureRedirect: '/homeowners/login' }));


//TODO: this should be a post
router.use('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
})

router.get('/dashboard'
           , user_utils.isLoggedIn
           , function(req, res){ res.render('homeowner-dashboard'); })

module.exports = router;
