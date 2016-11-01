var express = require('express')
,   router  = express.Router()
,   objectAssign = require('object-assign')
,   conf = require('../config')

router.get('/', function(req, res){
  var prd = objectAssign(conf.get('pages.main-sales-nav'),
                         conf.get('pages.main-sales'))
  res.render('main-sales.hbs', prd);
});

module.exports = router;
