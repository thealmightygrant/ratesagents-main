var express = require('express')
,   router  = express.Router();

router.get('/register', function(req, res){
  res.render('realtor-register');
});

router.get('/login', function(req, res){
  res.render('realtor-login');
});

module.exports = router;
