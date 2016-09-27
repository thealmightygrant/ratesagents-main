var express = require('express')
,   router  = express.Router()
,   user_utils = require('../utils/user_related')

//TODO: think about some better logic here
//      this is anything but /register and /login
router.use(/^((?!(\/register|\/login)).)*$/, function(req, res, next){
  res.locals.error_url = '/realtors/login'
  res.locals.model_name = "realtor"
  next();
}, user_utils.alreadyLoggedIn);

router.get('/register', function(req, res){
  res.render('realtor-register');
});

router.post('/register', function(req, res, next){
  res.locals.success_url = '/realtors/dashboard';
  res.locals.err_view = 'realtor-register';
  next();
}, user_utils.register);

router.get('/login', function(req, res){
  res.render('realtor-login');
});

router.post('/login', function(req, res, next){
  res.locals.success_url = '/realtors/dashboard';
  res.locals.err_view = 'realtor-login';
  next();
}, user_utils.login);


router.get('/dashboard', function(req, res){
  res.render('realtor-dashboard');
})

module.exports = router;
