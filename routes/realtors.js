var express = require('express')
,   router  = express.Router()
,   user_utils = require('../utils/user_related')

router.get('/register', function(req, res){
  res.render('realtor-register');
});

router.post('/register', function(req, res, next){
  res.locals.success_url = '/';
  res.locals.err_view = 'realtor-register';
  res.locals.model_name = 'realtor';
  next();
}, user_utils.register);

router.get('/login', function(req, res){
  res.render('realtor-login');
});

router.post('/login', function(req, res, next){
  res.locals.success_url = '/';
  res.locals.err_view = 'realtor-login';
  res.locals.model_name = 'realtor';
  next();
}, user_utils.login);

module.exports = router;
