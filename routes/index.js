var express = require('express')
,   router  = express.Router()
,   merge = require('lodash.merge')
,   conf = require('../config')

router.get('/', function(req, res){
  var prd = merge(conf.get('pages.main-sales-nav'),
                  conf.get('pages.main-sales'))
  res.render('main-sales.hbs', prd);
});

module.exports = router;
