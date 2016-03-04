var watson = require('watson-developer-cloud');
var configs = require('./configs').configs;

var concept_insights = watson.concept_insights({
  username: configs['conceptInsights']['username'],
  password: configs['conceptInsights']['password'],
  version: 'v2'
});

/*
*
*/

//Call the Watson Concepts API to extract concepts from supplied text
function getConceptsFromText(copy, callback){
  var params = {
    graph: '/graphs/wikipedia/en-20120601',
    text: copy
  };

  // Retrieve the concepts for input text
  concept_insights.graphs.annotateText(params, function(err, res) {
    if (err)
      throw err;
    else {
      callback(null, res);
    }
  });
}

module.exports = {
  getConceptsFromText : getConceptsFromText
}
