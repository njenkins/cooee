var express = require('express');
var router = express.Router();

var Flickr = require("flickrapi");
var configs = require('../configs').configs;
// middleware that is specific to this router

router.get('/:concept', function (req, res) {
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
      text: concept,
      sort: 'relevance',
      media: 'photos'
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
module.exports = router;
