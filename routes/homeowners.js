var express = require('express')
,   router  = express.Router()
,   user_utils = require('../utils/user_related')

//TODO: think about some better logic here
//NOTE: this is anything but /register, /login, and /logout
router.use(/^((?!(\/register|\/logout|\/login)).)*$/, function(req, res, next){
  res.locals.error_url = '/homeowners/login'
  res.locals.model_name = "homeowner"
  next();
}, user_utils.alreadyLoggedIn);

router.use(function(req, res, next){
  res.locals.model_name = 'homeowner';
  next();
})

router.get('/register', function(req, res){
  res.render('homeowner-register');
});

router.post('/register', function(req, res, next){
  res.locals.success_url = '/homeowners/dashboard';
  res.locals.err_view = 'homeowner-register';
  next();
}, user_utils.register);

router.get('/login', function(req, res){
  res.render('homeowner-login');
});

router.post('/login', function(req, res, next){
  res.locals.success_url = '/homeowners/dashboard';
  res.locals.err_view = 'homeowner-login';
  next();
}, user_utils.login);

router.use('/logout', function(req, res, next){
  res.locals.success_url = '/';
  res.locals.err_url = '/';
  next();
}, user_utils.logout)

router.get('/dashboard', function(req, res){
  res.render('homeowner-dashboard');
});

module.exports = router;
