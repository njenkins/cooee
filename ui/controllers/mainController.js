var app = angular.module("cooee", []);
app.controller("cooee", function($scope, $http) {
    $scope.articleCount = 5;
    getTopConcepts($scope.articleCount);

    //If samplset size changes, rebuild results

    /**
    Get top concepts from articles
    @param articleCount {int} Number of articles to use for analysis
    */
    function getTopConcepts(articleCount){
      $scope.progressMessage = 'Analyzing ' + articleCount + ' most recent articles to extract concepts.';
      $http.get('http://localhost:3000/'+articleCount).then(function(response){
        $scope.topResults = [];
        response.data.forEach(function(elem) {
          var concept = {};
          concept.label = elem[0];
          $scope.progressMessage = 'Looking for an image for ' + elem[0] +'.'
          $http.get('http://localhost:3000/image/'+elem[0]).then(function(result){
            $scope.progressMessage = 'Found an image for ' + elem[0]
            concept.image = result.data.path;
            $scope.topResults.push(concept);
          },function(e){
              $scope.progressMessage = 'Something went wrong.';
          });
        });
      }, function(e){
        $scope.progressMessage = 'Something went wrong.';
      });
    }
    $scope.getTopConcepts = getTopConcepts;
});
