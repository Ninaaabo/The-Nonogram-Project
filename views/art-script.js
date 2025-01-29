var blackFirst = true;
$(document).mousedown(function() {

    $(".square").bind('mouseover',function(){
        var current = $(this).attr('name');

        if(blackFirst){
            $(this).removeClass("hide_black");
            $('#' + current).attr("value", "black");
        }
        else {
            $(this).addClass("hide_black");
            $('#' + current).attr("value", "white");
        }
    });
})
.mouseup(function() {
  $(".square").unbind('mouseover');
});

$('.square').mousedown(function() {
    var current = $(this).attr('name');

    if($(this).hasClass("hide_black")){
        $(this).removeClass("hide_black");
        blackFirst = true;
        $('#' + current).attr("value", "black");
    }
    else{
        $(this).addClass("hide_black");
        blackFirst = false;
        $('#' + current).attr("value", "white");
    }

});


$("#submit").on("click", () =>{
    var popup = document.getElementById("myPopup");
  popup.classList.toggle("show");
})