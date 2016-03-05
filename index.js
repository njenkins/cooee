var express = require('express');
var conceptUtils = require('./conceptUtils');
var app = express();
var abcScraper = require('./ABCScraper');
var async = require('async');
var fbComments = require('./data/fbComments').comments;
var facebookUtils = require('./facebookUtils');
var utils = require('./utils');
var Flickr = require("flickrapi");
var configs = require('./configs').configs;
//For proto serve front end from subdirectory
app.use('/ui', express.static('ui'));


app.get('/', function (req, res) {
  //Get all article links from ABC news site
  abcScraper.getAllArticleLinks('http://abc.net.au/news','.module-body h3 a', function(urls){
      var concepts = {};
      var trawlCount = 0;
      var trawlCountLimit = 20;
      //Get plain text of each article body
      async.forEach(urls, function(url, callback) {
        trawlCount++;
        if(trawlCount < trawlCountLimit) {
          //Get the number of fb interactions for url
          facebookUtils.getInteractionCount(url, function(count){
              //Get plain text of article
              abcScraper.getArticlePlainText(url, function(response){

              //Get concepts from the article text
              conceptUtils.getConceptsFromText(response, function(err, response){
                for (var concept in response) {
                  if (response.hasOwnProperty(concept)) {
                    //Multiply text for weighting. Each interaction multiplies
                    //There is nothing scientific about this. Just an example of weighting
                    //concepts[concept] = response[concept] * (count + 1);
                    if(concepts.hasOwnProperty(concept)){
                      
                      concepts[concept] = concepts[concept] + (response[concept] * count);
                    }
                    else {
                      concepts[concept] = response[concept] * count;
                    }

                  }

              }
              callback();
              });

            });
          });

        }

/*

          */


      }, function(){
        var sortedConcepts = utils.sortProperties(concepts);
//        var conceptsSorted = Object.keys(concepts).sort(function(a,b){return concepts[a]-concepts[b]})
        res.json(sortedConcepts);
      });




  });



});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
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
