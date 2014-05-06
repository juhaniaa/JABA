"use strict";
var JABA = JABA || {};

JABA.Message = function(messageText, messageType){
    
    var messageDiv = $("#messages");
    messageDiv.empty();
    
    // skjut in p tag som innehåller meddelandet
    var messageP = $("<p class='"+messageType+"'>"+ messageText+"</p>").appendTo(messageDiv);
    
    //lägg till close button
    var messageClose = $("<a class='messageClose' href='#'></a>").appendTo(messageP);
    messageClose.click(function(event){
        event.preventDefault();
        messageP.remove();
    });
        
    // fixa så timer som stänger efter x sekunder?
        
    // lägg till före app
    


};

