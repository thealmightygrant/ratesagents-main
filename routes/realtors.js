var express = require('express')
,   router  = express.Router()
,   models = require('../models/index')
,   bcrypt = require('bcryptjs')
,   Promise = require("bluebird");

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
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    var newRealtor = models.Realtor.create({
      email: email,
      name: name,
      password: hash,
      username: username
    }).then(function(realtor) {
      //console.log("new user: ", res.json(realtor));
      console.log("added a new user!");
    });
  }
})

router.get('/login', function(req, res){
  res.render('realtor-login');
});

router.post('/login', function(req, res){
  var username = req.body.username
  ,   password = req.body.password;

  req.checkBody('username', 'Please give us your username or email :D').notEmpty();
  req.checkBody('password', 'Please tell us some kind of password. We hope it\'s yours...').notEmpty();

  var errors = req.validationErrors();

  if(errors){
    res.render('realtor-login', {
      errors: errors
    })
  }
  else {
    Promise.any(
      [
        models.Realtor.find({
          where: {
            username: username
          }
        }),
        models.Realtor.find({
          where: {
            email: username
          }
        })]).then(function(realtor) {
          if(bcrypt.compareSync(password, realtor.password)) {
            console.log("passwords matched!!");
          }
          else {
            console.log("passwords did not match!!!");
          }
        })
  }
})

module.exports = router;
