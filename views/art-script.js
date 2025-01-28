$(document).mousedown(function() {
    var first = true;
    var blackOut = true;
    $(".square").bind('mouseover',function(){
        var current = $(this).attr('name');
        if(first){
            first = false;
            blackOut = $(this).hasClass("hide_black") ;
        }
        if(blackOut){
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
        // console.log("current is ", current);
        // console.log($('#' + current).attr("name"), "has value: " + $('#' + current).attr("value"));
        $('#' + current).attr("value", "black");
    }
    else{
        $(this).addClass("hide_black");
        // console.log("current is ", current);

        // console.log($('#' + current).attr("name"), "has value: " + $('#' + current).attr("value"));
        $('#' + current).attr("value", "white");
    }

});
