var app = angular.module("wysiwyg", []);
app.controller("wysiwyg", function($scope, $http) {
  $scope.article = {
    text : null
  };

  $scope.getAllTopics = function(text){
  var postData = {};
  postData.message = text;
  $scope.searching = true;
    $http.post('/concepts', postData).then(function(successResponse){
      $scope.concepts = [];
        var concepts = successResponse.data;
        for (var concept in concepts) {
          if (concepts.hasOwnProperty(concept)) {
            $scope.concepts.push(concept);
            $scope.searching = false;
          }
        }
    });

  }
});

/*
This directive allows us to pass a function in on an enter key to do what we want.
 */
app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

            }
        });
    };
});

app.directive('getThumbnail', function($http){
  return {
    scope: {
      concept: '@concept'
    },
    link: function(scope, element, attrs) {
      $http.get('/images/'+scope.concept).then(function(result){
        var thumb = result.data.path;
        scope.thumb = thumb;
      },function(e){
        console.log('something went wrong');
      });
    },
    template: '<div class="chip"><img ng-src="{{thumb}}"/>{{concept}}<i class="material-icons">close</i></div>'
  }
});
