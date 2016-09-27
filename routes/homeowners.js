var express = require('express')
,   router  = express.Router()
,   user_utils = require('../utils/user_related')

router.get('/register', function(req, res){
  res.render('homeowner-register');
});

router.post('/register', function(req, res, next){
  res.locals.success_url = '/homeowners/dashboard';
  res.locals.err_view = 'homeowner-register';
  res.locals.model_name = 'homeowner';
  next();
}, user_utils.register);

router.get('/login', function(req, res){
  res.render('homeowner-login');
});

router.post('/login', function(req, res, next){
  res.locals.success_url = '/homeowners/dashboard';
  res.locals.err_view = 'homeowner-login';
  res.locals.model_name = 'homeowner';
  next();
}, user_utils.login);

router.get('/dashboard', function(req, res){
  res.render('homeowner-dashboard');
});

module.exports = router;
