var app = angular.module("cooee", []);
app.controller("cooee", function($scope, $http) {
    getTopConcepts(20);
    /*
    Get top concepts from articles
    @param articleCount {int} Number of articles to use for analysis
    */
    function getTopConcepts(articleCount){
      $http.get('http://localhost:3000/'+articleCount).then(function(response){
        $scope.topResults = [];
        response.data.forEach(function(elem) {
          var concept = {};
          concept.label = elem[0];
          $http.get('http://localhost:3000/image/'+elem[0]).then(function(result){
            concept.image = result.data.path;
            $scope.topResults.push(concept);
          },function(e){
              console.log('something went wrong');
          });
        });
      }, function(e){
        console.log('something went wrong');
      });
    }
    $scope.getTopConcepts = getTopConcepts;
});
