var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var conceptUtils = require('../conceptUtils');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

router.post('/', function(req, res){
  var text = req.body.message;
  conceptUtils.getConceptsFromText(text, function(err, response){
    res.json(response);
  });
    //res.json(res);
});

module.exports = router;
