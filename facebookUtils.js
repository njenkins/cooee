var request = require('request');

var pageIds = {
}


/*
Use the facebook graph to get all posts from target page
*/
function getAllPostsByPage(pageId){

}

/*
get the number of interactions registered on the facebook graph for target url
*/
function getInteractionCount(url, callback){
  var graphUrl = 'https://graph.facebook.com/' + url;
  request(graphUrl, function (error, response, result) {
    if (!error && response.statusCode == 200) {
      result = JSON.parse(result);
      var count = result.shares || 0;
      callback(count);
    }
  });
}

/*
Use the facebook graph to get all comments on a target post
*/
function getAllCommentsOnPost(postId){
  ///object-id/comments
}

module.exports = {
  getAllPostsByPage : getAllPostsByPage,
  getAllCommentsOnPost : getAllCommentsOnPost,
  getInteractionCount : getInteractionCount
}
