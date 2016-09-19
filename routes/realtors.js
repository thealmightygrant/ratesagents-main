var express = require('express')
,   router  = express.Router()
,   bcrypt = require('bcryptjs')
,   Promise = require("bluebird")
,   models = require('../models/index')
,   user_utils = require('../utils/user_related')

router.get('/register', function(req, res){
  res.render('realtor-register');
});

router.post('/register', user_utils.register.bind(null,
                                                  {
                                                    suc_view: 'realtor-dashboard',
                                                    err_view: 'realtor-register',
                                                    model_name: 'Realtor'
                                                  }));

router.get('/login', function(req, res){
  res.render('realtor-login');
});

router.post('/login', user_utils.login.bind(null,
                                            {
                                              suc_view: 'realtor-dashboard',
                                              err_view: 'realtor-login',
                                              model_name: 'Realtor'
                                            }));

module.exports = router;
