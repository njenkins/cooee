var express = require('express');
var conceptUtils = require('./conceptUtils');
var app = express();
var abcScraper = require('./ABCScraper');
var async = require('async');
var facebookUtils = require('./facebookUtils');
var utils = require('./utils');
var Flickr = require("flickrapi");
var configs = require('./configs').configs;
//For proto serve front end from subdirectory
app.use('/ui', express.static('ui'));

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
        });
      });
    }, function(){

      var sortedConcepts = utils.sortProperties(concepts);
      res.json(sortedConcepts.slice(0,5));
    });
  });
});



app.get('/image/:concept', function (req, res) {
  //Move all this flickr stuff into it's own module at some point.
  //Maybe use a different image api
  //Just a quick hack to get it working
  var flickrOptions = {
        api_key: configs.flickr.api_key,
        secret: configs.flickr.secret
  };
  var concept = req.params.concept;

  /*
  TODO - Check if a local image for target concept exists,
  If so, use this. If not, use Flickr API to retrieve
  */

  Flickr.tokenOnly(flickrOptions, function(error, flickr) {
    flickr.photos.search({
      text: concept
    }, function(err, result) {
      var firstPhoto = result.photos.photo[0];
      if(firstPhoto){
        flickr.photos.getInfo({photo_id : firstPhoto.id}, function(e, flickr){
          var image = {};
          image.path =  'https://farm' + flickr.photo.farm+'.staticflickr.com/'+flickr.photo.server+'/'+flickr.photo.id+'_'+flickr.photo.secret+'_q.jpg';
          res.json(image);
        });
      }
      }
    );

  });
});
//Start app on port 3000.
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
