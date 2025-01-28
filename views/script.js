
var fillWith = "hide_black";
var firstBlack = true;
var firstX = true;
var numArr = JSON.parse($("#store_data").attr("data"));

function start(){
    //activate this when game start to check for empty number array
    numArr[0].forEach((arr, i) => {
        if(arr.length === 0) 
            $("#x-" + i).addClass("done");
        if(i%5===4){
            for(var j = 0; j < numArr[1].length; j++){
                console.log("im here")
                $("#"+i + "-" + j).css("border-right-width", "5px");

            }
        }
    })
    numArr[1].forEach((arr, i) => {
        if(arr.length === 0) 
            $("#y-" + i).addClass("done");
        if(i%5===4){
            for(var j = 0; j < numArr[0].length; j++){
                console.log("im here")
                $("#"+j + "-" + i).css("border-bottom-width", "5px");

            }
        }
    })
    
}

function pressed(x, y){
    //activate this function whenever black out
    //gonna check the numbers see if it all good
    
    //check x
    function checkNum(x, y, isHorizontal){
        var num_req = numArr[(isHorizontal)?1:0][(isHorizontal)?y:x];
        const result = [];
        var middleWhite = false;

        var upper_i = (isHorizontal)?numArr[0].length:numArr[1].length;
        for(var i = 0; i < upper_i; i++){
            console.log("im here")
            var currentID = (isHorizontal)?i + "-" + y:x + "-" + i;
            console.log("current id: " + currentID);
            var currentButton = $("#" + currentID);
            var isblack = !currentButton.hasClass("hide_black");
            console.log("current button id : ", currentButton.attr("id"), "current button class : ", currentButton.attr("class"));
            console.log("isblack?: ", isblack);
            if(result.length === 0){
                if(isblack) result.push(1);
            }
            else{
                if(isblack){
                    if(middleWhite){
                        middleWhite = false;
                        result.push(1);
                    }
                    else result[result.length-1]++;
                }
                else middleWhite = true;
            }
        }
        console.log("is horizontal: ", isHorizontal);
        console.log("result is ", JSON.stringify(result));
        console.log("num req is ", JSON.stringify(num_req))

        var isEqual =  result.length === num_req.length && num_req.reduce((acc, num, i) => acc && (result[i] === num), true);
        console.log("is equal: ", isEqual)
        if(isEqual) {
            if (isHorizontal) $("#y-" + y).addClass("done")
            else $("#x-" + x).addClass("done");
        }
        else{
            if (isHorizontal) $("#y-" + y).removeClass("done")
            else $("#x-" + x).removeClass("done");
        }

    }
    
    console.log("checking is horizontal")
    checkNum(x,y, true);
    checkNum(x,y, false);

    //check if the whole table is cleared

    var allDone = true;
    for(var i = 0; i < numArr[0].length; i++){
        allDone = allDone && $("#x-"+ i).hasClass("done");
    }
    for(var i = 0; i < numArr[1].length; i++){
        allDone = allDone && $("#y-"+ i).hasClass("done");
    }
    if (allDone)console.log("YOU'RE ALL DONE");
    if (allDone) document.getElementById("over").click();

}


start();

$(document).mousedown(function() {
    var first = true;
    var blackOut = true;
    $(".square").bind('mouseover',function(){

        if((fillWith === "hide_x" && firstX)) {
            firstX = !firstX;
            first = false;
            if(fillWith === "hide_x") blackOut =  !$(this).hasClass("hide_x");
        }
        else{
            if(first){
                first = false;
                
                if(fillWith === "hide_x")$(this).toggleClass("hide_x");
                
                blackOut = firstBlack;
                console.log("is blacking out: " + blackOut)
            }
            if(blackOut)
                if(fillWith === "hide_black" && $(this).hasClass("hide_x")) $(this).removeClass(fillWith);
                if(fillWith === "hide_x" && $(this).hasClass("hide_black")) $(this).removeClass(fillWith);


            if(!blackOut) $(this).addClass(fillWith);
    
            if(fillWith === "hide_black"){
                pressed($(this).attr("x"), $(this).attr("y"));
            }
        }
        
    });
})
.mouseup(function() {
  $(".square").unbind('mouseover');
  firstX = true;
});

$('.square').mousedown(function() {
    if(fillWith === "hide_black") {

        if($(this).hasClass("hide_x")) $(this).toggleClass(fillWith);  
        if(!$(this).hasClass("hide_black")) firstBlack = true;
        else firstBlack = false
        pressed($(this).attr("x"), $(this).attr("y"));

    }
    
    
    if(fillWith === "hide_x" && $(this).hasClass("hide_black")) {
        console.log("im in here, class of this is ", $(this).attr("class"));
        $(this).toggleClass(fillWith);
        firstX = true;
        console.log("im in here,toggled, class of this is ", $(this).attr("class"));

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