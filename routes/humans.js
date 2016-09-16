var express = require('express')
,   router  = express.Router();

router.get('/register', function(req, res){
  res.render('human-register');
});

router.get('/login', function(req, res){
  res.render('human-login');
});

module.exports = router;
