$(document).ready(function(){
  $.get('http://localhost:3000/', function(results){
    $('.loading').hide();
    //Unique concepts required to handle watson returning duplicates.
    var rank = 1;
    results.forEach(function(elem) {
      if(rank < 6){
        $.get('http://localhost:3000/image/'+elem[0], function(result){
              $('.row').append('<div class="col-5"><img class="img-circle" src="'+result.path+'" alt="catholic church"/><span class="concept">'+elem[0]+'</span><span class="score">RANK '+rank+'</score></div>');
        });
        rank++;
  

      }

    });

  });
});
