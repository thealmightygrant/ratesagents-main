var express = require('express')
,   passport = require('passport')
,   router  = express.Router()
,   data_promises = require('../utils/data_promises')
,   user_utils = require('../utils/user_related')

//TODO: think about some better logic here
//      this is anything but /register and /login
// router.use(/^((?!(\/register|\/logout|\/login)).)*$/, function(req, res, next){
//   res.locals.error_url = '/realtors/login'
//   res.locals.model_name = "realtor"
//   next();
// }, user_utils.alreadyLoggedIn);

router.use(function(req, res, next){
  res.locals.model_name = 'realtor';
  next();
})

router.get('/register', function(req, res){
  res.render('realtor-register');
});

router.post('/register'
            , function(req, res, next){
              res.locals.err_view = 'realtor-register';
              next();
            }
            , user_utils.validateRegister
            , passport.authenticate('realtor-local-register',
                                    { successRedirect: '/realtors/dashboard',
                                      failureRedirect: '/realtors/register',
                                      failureFlash: true }));

router.get('/login', function(req, res){
  res.render('realtor-login');
});

router.post('/login'
            , function(req, res, next){
                res.locals.error_view = 'realtor-login'
                next();
            }
            , user_utils.validateLogin
            , passport.authenticate('realtor-local-login',
                                    { successRedirect: '/realtors/dashboard',
                                      failureRedirect: '/realtors/login',
                                      failureFlash: true }));

//TODO: add location to scope
router.get('/auth/facebook'
           , passport.authenticate('realtor-fb-login'
                                   , { session: false
                                       , scope : ['email']}));

// handle the callback after facebook has authenticated the user
router.get('/auth/facebook/callback'
           , passport.authenticate('realtor-fb-login', {
             failureRedirect : '/realtors/login'
           })
           , function(req, res) {
             //TODO: add flash message for fb login/registration
             res.redirect('/realtors/dashboard')
           });


//TODO: this should be a post
router.use('/logout', function(req, res, next){
  req.logout();
  res.redirect('/');
})

router.get('/dashboard'
           , user_utils.isLoggedIn
           , function(req, res){ res.render('realtor-dashboard'); })

module.exports = router;
