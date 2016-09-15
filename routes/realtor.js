var express = require('express')
,   router  = express.Router();

router.get('/realtor/register', function(req, res){
  res.render('realtor-register');
});

router.get('/realtor/login', function(req, res){
  res.render('realtor-login');
});

module.exports = router;
