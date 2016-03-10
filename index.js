var express = require('express');
var conceptUtils = require('./conceptUtils');
var app = express();
var abcScraper = require('./ABCScraper');
var async = require('async');
var facebookUtils = require('./facebookUtils');
var utils = require('./utils');
var configs = require('./configs').configs;
var images = require('./routes/images');
var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//For proto serve front end from subdirectory
app.use('/ui', express.static('ui'));

app.use('/images', images);
app.post('/concepts', function(req, res){
    res.json(response);
  });
});
app.get('/:maxResults?', function (req, res) {
  var maxResults = req.params.maxResults || 10;
  abcScraper.getAllArticleLinks('http://abc.net.au/news','.module-body h3 a', maxResults, function(urls){

    var concepts = {};

    var allArticleContent = [];
    //Get plain text of each article body
    async.forEach(urls, function(url, callback) {
      //Get the number of fb interactions for url
      facebookUtils.getInteractionCount(url, function(count){
          //Get plain text of article
          abcScraper.getArticlePlainText(url, '.article.section', function(response){
          /*This takes alot of time. Best approach would be to cache results locally
          and test url as key before scraping again*/
          if(response){
            //Get concepts from the article text
            conceptUtils.getConceptsFromText(response, function(err, response){
              for (var concept in response) {
                if (response.hasOwnProperty(concept)) {
                  //Multiply text for weighting. Each interaction multiplies
                  //There is nothing scientific about this. Just an example of weighting

                  //Hide common scraped values not related to article content.
                  var excludedConcepts = [
                    'ABC News',
                    'Typeof',
                    'News',
                    'MPEG-4 Part 14',
                    'Million',
                    'Thousand',
                    'Hundred'
                  ];
                  if(excludedConcepts.indexOf(concept) == -1){
                    if(concepts.hasOwnProperty(concept)){
                        concepts[concept] = concepts[concept] + (response[concept] * count);
                    }
                    else {
                      concepts[concept] = response[concept] * count;
                    }
                  }
                }
              }
              callback();
            });
          }
          else {
            callback();
          }

        });
      });
    }, function(){

      var sortedConcepts = utils.sortProperties(concepts);
      res.json(sortedConcepts.slice(0,5));
    });
  });
});

//Start app on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
