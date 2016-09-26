var express = require('express')
,   router  = express.Router()
,   user_utils = require('../utils/user_related')

router.get('/register', function(req, res){
  res.render('homeowner-register');
});

router.post('/register', user_utils.register.bind(null,
                                                  {
                                                    suc_view: 'homeowner-dashboard',
                                                    err_view: 'homeowner-register',
                                                    model_name: 'homeowner'
                                                  }));


router.get('/login', function(req, res){
  res.render('homeowner-login');
});

router.post('/login', user_utils.login.bind(null,
                                            {
                                              suc_view: 'homeowner-dashboard',
                                              err_view: 'homeowner-login',
                                              model_name: 'homeowner'
                                            }));

module.exports = router;
