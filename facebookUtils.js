var fbPosts = require('./data/fb-posts').posts;

var pageIds = {
}

/*

Use the facebook graph to get all posts from target page
*/
function getAllPostsByPage(pageId){

}

/*
Use the facebook graph to get all comments on a target post
*/
function getAllCommentsOnPost(postId){
  ///object-id/comments
}

module.exports = {
  getAllPostsByPage : getAllPostsByPage,
  getAllCommentsOnPost : getAllCommentsOnPost
}
