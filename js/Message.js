"use strict";
var JABA = JABA || {};

JABA.Message = function(messageText, messageType){
    
    var messageP = $("#messages p").addClass(messageType).text(messageText).fadeIn(400);
    //var messageP = $("<p class='"+messageType+"'>"+ messageText+"</p>").fadeIn(400).appendTo(messageDiv);
    
    var timeoutId = window.setTimeout(closeMessage, 2000);
    
    function closeMessage(){
        messageP.text(" ").removeClass(messageType);
        window.clearTimeout(timeoutId);
    }
};

