var express = require('express')
,   router  = express.Router();

router.get('/', function(req, res){
  res.render('realtor-sales');
});

module.exports = router;
