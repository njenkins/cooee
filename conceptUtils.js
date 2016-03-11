var watson = require('watson-developer-cloud');
var configs = require('./configs').configs;

var concept_insights = watson.concept_insights({
  username: configs.conceptInsights.username,
  password: configs.conceptInsights.password,
  version: 'v2'
});

/**
Call the Watson Concepts API to extract concepts from supplied text
@param copy {string} Text to analyze
@param callback {function} Response handler
*/
function getConceptsFromText(copy, callback){
  var relevanceThreshold = 0.6;
  var params = {
    graph: '/graphs/wikipedia/en-20120601',
    text: copy
  };

  // Retrieve the concepts for input text
  concept_insights.graphs.annotateText(params, function(err, res) {
    if (err){
      console.log(err);
      //throw err;
    }
    else {
      //At this point we're only using label and rank
      var concepts = {};
      var annotations = res.annotations;
      annotations.forEach(function(annotation) {
        //Try to filter out noise
        if(annotation.score > relevanceThreshold){
          var label = annotation.concept.label;
          concepts[label] = annotation.score;
        }
      });
      callback(null, concepts);
    }
  });
}

module.exports = {
  getConceptsFromText : getConceptsFromText
}
