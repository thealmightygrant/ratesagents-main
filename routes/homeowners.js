var express = require('express')
,   passport = require('passport')
,   router  = express.Router()
,   data_promises = require('../utils/data_promises')
,   user_utils = require('../utils/user_related')

// //TODO: think about some better logic here
//TODO: think about some better logic here
//      this is anything but /register and /login
// router.use(/^((?!(\/register|\/logout|\/login)).)*$/, function(req, res, next){
//   res.locals.error_url = '/homeowners/login'
//   res.locals.model_name = "homeowner"
//   next();
// }, user_utils.alreadyLoggedIn);

router.use(function(req, res, next){
  res.locals.model_name = 'homeowner';
  next();
})

router.get('/register', function(req, res){
  res.render('homeowner-register');
});

router.post('/register'
            , function(req, res, next){
              res.locals.err_view = 'homeowner-register';
              next();
            }
            , user_utils.validateRegister
            , passport.authenticate('homeowner-local-register',
                                    { successRedirect: '/homeowners/dashboard',
                                      failureRedirect: '/homeowners/register',
                                      failureFlash: true }));

router.get('/login', function(req, res){
  res.render('homeowner-login');
});

router.post('/login'
            , function(req, res, next){
                res.locals.error_view = 'homeowner-login'
                next();
            }
            , user_utils.validateLogin
            , passport.authenticate('homeowner-local-login',
                                    { successRedirect: '/homeowners/dashboard',
                                      failureRedirect: '/homeowners/login',
                                      failureFlash: true }));

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


//TODO: this should be a post
router.use('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
})

router.get('/dashboard'
           , user_utils.isLoggedIn
           , function(req, res){ res.render('homeowner-dashboard'); })

module.exports = router;
