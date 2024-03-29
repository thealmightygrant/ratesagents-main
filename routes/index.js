var express = require('express')
,   router  = express.Router()
,   merge = require('lodash.merge')
,   conf = require('../config')

router.get('/', function(req, res){
  var prd = merge(res.locals
                  , conf.get('pages.main-sales-nav')
                  , conf.get('pages.main-sales')
                  //, { includeChart: true }
                 )
  res.render('main-sales.hbs', prd);
});

router.get('/sign-in', function(req, res){
  var prd = merge(res.locals
                  , conf.get('pages.main-sales-nav')
                  , conf.get('pages.main-sign-in')
                 )
  res.render('main-sign-in.hbs', prd);
});


module.exports = router;
