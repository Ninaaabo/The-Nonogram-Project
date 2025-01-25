var fillWith = "hide_black";

$(document).mousedown(function() {
    var first = true;
    var blackOut = true;
    $(".square").bind('mouseover',function(){

        if(first){
            first = false;
            if(fillWith === "hide_x")$(this).toggleClass("hide_x");

            blackOut = $(this).hasClass("hide_black") && $(this).hasClass("hide_x");
        }
        if(blackOut){
            if(fillWith === "hide_black" && $(this).hasClass("hide_x")) $(this).removeClass(fillWith);
            if(fillWith === "hide_x" && $(this).hasClass("hide_black")) $(this).removeClass(fillWith);
        }
        else $(this).addClass(fillWith);
    });
})
.mouseup(function() {
  $(".square").unbind('mouseover');
});

$('.square').mousedown(function() {
    if(fillWith === "hide_black" && $(this).hasClass("hide_x")) {
        $(this).toggleClass(fillWith);
    }
    if(fillWith === "hide_x" && $(this).hasClass("hide_black")) {
        $(this).toggleClass(fillWith);
    }    
});

$(document).ready(function() {
    $(".choice").click(function() {
        if($(this).attr("id") === "fill"){
            $("#fill").addClass("red_out");
            $("#x").removeClass("red_out");
            fillWith = "hide_black";
        }
        else{
            $("#fill").removeClass("red_out");
            $("#x").addClass("red_out");
            fillWith = "hide_x";
        }
    });
  });