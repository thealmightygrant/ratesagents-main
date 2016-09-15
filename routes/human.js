var express = require('express')
,   router  = express.Router();

router.get('/human/register', function(req, res){
  res.render('human-register');
});

router.get('/human/login', function(req, res){
  res.render('human-login');
});

module.exports = router;
