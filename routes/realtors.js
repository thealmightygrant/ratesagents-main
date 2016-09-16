var express = require('express')
,   router  = express.Router()
,   models = require('../models/index')
,   bcrypt = require('bcryptjs');

router.get('/register', function(req, res){
  res.render('realtor-register');
});

router.post('/register', function(req, res){
  var name = req.body.name
  ,   email = req.body.email
  ,   username = req.body.username
  ,   password = req.body.password
  ,   passwordconfirm = req.body.passwordconfirm;

  req.checkBody('name', 'Please tell us your name :D').notEmpty();
  req.checkBody('email', 'Please tell us your email :D').notEmpty();
  //TODO: update these checks
  req.checkBody('username', 'Please give us a username :D').notEmpty();
  req.checkBody('password', 'Please tell us some kind of password').notEmpty();
  req.checkBody('passwordconfirm', 'Sorry, these passwords don\'t match. Please try again').equals(req.body.password);
  req.checkBody('email', 'Please tell us a REAL email.').isEmail();

  var errors = req.validationErrors();

  if(errors){
    res.render('realtor-register', {
      errors: errors
    })
  }
  else {
    var newRealtor = models.Realtor.create({
      email: req.body.email,
      name: req.body.name,
      password: req.body.password,
      userid: req.body.userid
    }).then(function(realtor) {
      console.log("new user: ", res.json(realtor));
    });
  }
})

router.get('/login', function(req, res){
  res.render('realtor-login');
});

module.exports = router;
