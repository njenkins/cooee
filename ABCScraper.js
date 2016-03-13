var cheerio = require('cheerio');
var request = require('request');
var dbUtils = require('./dbUtils');

/**
Get the plain text article content for use in proto.
A real world use case could use a content api to extract cleanly.
@param url {string} url for article to scrape text content of
@param articleContentSelector {string} css selector for article content area
@param callback {function} response handler
*/
function getArticlePlainText(url, articleContentSelector, callback){
  //todo - first check if url content is in cache

  request(url, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var plainText = $(articleContentSelector).text().replace(/\s{2,9999}/g, ' ');
      dbUtils.addRecord([url, plainText]);
      callback(plainText);
    }
    });
}

/**
Get all article links from the just in page for proto. Real world application could use
a content api or harvest links shared via the facebook / twitter apis.
@param landingUrl {string} The url to harvest links from
@param articleLinkSelector {string} css selector for article link
@param maxResults {int} The maximum number of concepts to return
@param callback {function} Response handler
*/
function getAllArticleLinks(landingUrl, articleLinkSelector, maxResults, callback){
  request(landingUrl, function (error, response, html) {
    if (!error && response.statusCode == 200) {
      var $ = cheerio.load(html);
      var $links = $(articleLinkSelector);
      var urls = []
      $links.each(function (i,v){
        if(urls.length < maxResults){
          //Make links absolute
          var url = 'http://abc.net.au' + $(v).attr('href');
          //To prevent inflated results, make sure link is unique
          if(urls.indexOf(url) == -1){
            urls.push(url);
          }
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
