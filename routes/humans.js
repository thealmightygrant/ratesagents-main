var express = require('express')
,   router  = express.Router()
,   user_utils = require('../utils/user_related')

router.get('/register', function(req, res){
  res.render('human-register');
});

router.post('/register', user_utils.register.bind(null,
                                                  {
                                                    suc_view: 'human-dashboard',
                                                    err_view: 'human-register',
                                                    model_name: 'Human'
                                                  }));


router.get('/login', function(req, res){
  res.render('human-login');
});

router.post('/login', user_utils.login.bind(null,
                                            {
                                              suc_view: 'human-dashboard',
                                              err_view: 'human-login',
                                              model_name: 'Human'
                                            }));

module.exports = router;
