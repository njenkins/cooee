var cheerio = require('cheerio');
var request = require('request');

/*
Get the plain text article content for use in proto.
A real world use case could use a content api to extract cleanly
*/
function getArticlePlainText(url, callback){
  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var plainText = $('.article.section').text().replace(/\s{2,9999}/g, ' ');
        callback(plainText);
      }
    });
}

/**
Get all article links from the just in page for proto. Real world application could use
a content api or harvest links shared via the facebook / twitter apis.
*/
function getAllArticleLinks(callback){
  request('http://www.abc.net.au/news/justin/', function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var $links = $('.article-index h3 a');
      var urls = []
      $links.each(function (i,v){
        if(urls.length < 10){
          //Make links absolute
          urls.push('http://abc.net.au' + $(v).attr('href'));

        }
      });
      callback(urls);
    }
  });
}

module.exports = {
  getArticlePlainText : getArticlePlainText,
  getAllArticleLinks : getAllArticleLinks
}
