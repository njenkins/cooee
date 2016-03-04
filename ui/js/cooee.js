$(document).ready(function(){
  //Some dummy images for proto.
  //REal world application would call something like the Wikipedia API to find related image
  var images = [
    'fire.jpg',
    'map.jpg',
    'medicine.jpg',
    'sun.jpg',
    'turnbull.jpg'
  ];
  
  $.get('http://localhost:3000/', function(results){
    $('.loading').hide();
    //Unique concepts required to handle watson returning duplicates.
    var uniqueConcepts = [];
    var rank = 0;

    for(var i = 0; i < results.length; i++){

      var concept = results[i].concept.label;
      if(uniqueConcepts.length < 5){
        if( (uniqueConcepts.indexOf(concept) == -1)) {
          rank++;
          uniqueConcepts.push(concept);
          var score = results[i].score;
          $('.row').append('<div class="col-5"><img class="img-circle" src="images/' +images[rank-1] +'" alt="catholic church"/><span class="concept">'+concept+'</span><span class="score">RANK '+rank+'</score></div>');
        }

      }

      }
  });
});
