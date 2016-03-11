var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var conceptUtils = require('../conceptUtils');
var abcScraper = require('../abcScraper');
router.use(bodyParser.json()); // support json encoded bodies
router.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

router.post('/:contentSrcType', function(req, res){
  if(req.params.contentSrcType == 'text'){
    if(req.body.message){
      var text = req.body.message;
      conceptUtils.getConceptsFromText(text, function(err, response){
        res.json(response);
      });
        //res.json(res);
    }
    else {
      res.status(204).json({});
    }
  }
  else if(req.params.contentSrcType == 'url'){
    abcScraper.getArticlePlainText(req.body.url, '.article.section', function(text){
      conceptUtils.getConceptsFromText(text, function(err, response){
        if(err){
          console.log(err);
          res.status(500).json({});
        }
        else {
          res.json(response);
        }
      });
    });
  }
});

module.exports = router;
