var express = require('express');
var conceptUtils = require('./conceptUtils');
var app = express();
var abcScraper = require('./ABCScraper');
var async = require('async');
var fbComments = require('./data/fbComments').comments;

//For proto serve front end from subdirectory
app.use('/ui', express.static('ui'));


app.get('/', function (req, res) {
  //Get all article links from ABC news site
  abcScraper.getAllArticleLinks(function(urls){
      var textChunk;
      //Get plain text of each article body
      async.forEach(urls, function(url, callback) {

          //Get plain text of article
          abcScraper.getArticlePlainText(url, function(response){
            textChunk += response;
            callback();
          });


      }, function(){
        //Add user comments to chunk
        fbComments['data'].forEach(function(comment) {
          textChunk += comment.message;
        });
        //Get concepts from the article text
        conceptUtils.getConceptsFromText(textChunk, function(err, response){
          var annotations = response['annotations'];
          res.json(annotations);
        });
      });




  });



});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
