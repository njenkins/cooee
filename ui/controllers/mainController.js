var app = angular.module("cooee", []);
app.controller("cooee", function($scope, $http) {
  $http.get('http://localhost:3000/').then(function(response){
    var rank = 1;
    var excludedConcepts = [
      'ABC News',
      'Typeof',
      'MPEG-4 Part 14'
    ];
    $scope.topResults = [];
    response.data.forEach(function(elem) {
      if(excludedConcepts.indexOf(elem[0]) == -1){
        if(rank < 6){
          var concept = {};
          concept.label = elem[0];
          $http.get('http://localhost:3000/image/'+elem[0]).then(function(result){
            concept.image = result.data.path;
            $scope.topResults.push(concept);
          },function(e){
              console.log('something went wrong');
          });
          rank++;
        }

    }
    });
  }, function(e){
    console.log('something went wrong');
  });
});
