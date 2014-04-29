"use strict";
var JABA = JABA || {};

JABA.Booking = function(bId, bName, bDate, bTime, bDesc){
    
    
    var that = this;
    var rowChoice = bTime - 8;
    var colChoice = new Date(bDate).getDay() - 1; 
    var chosenRow = $("#calendar .column:eq("+colChoice+") .row").eq(rowChoice);
    chosenRow.addClass("appointed");
    chosenRow.click(function(){
        
        // skapa en div som ligger ovanpå allt
        var $newBack = $("<div id='newBack'></div>");
        
        // fyll diven med formuläret
        var $newB = $("<div id='newB'></div>");
        
        var postInfo = "php/changeBooking.php";    
    
        var $formForm = $("<form action='" + postInfo + "' method='post'></form>");
        $formForm.appendTo($newB);
        
        var $formLabelId = $("<label for='bookingId'>Booking Nr:</label>").appendTo($formForm);
        var $formBookingId = $("<input type='text' name='bookingId' value='"+bId+"' readonly='readonly'/>").appendTo($formForm);
        
        function createFormPiece(name, bValue){
            var $formPieceDiv = $("<div></div>");
            
            var formLabel = $("<label for='new" + name +"'>" + name + "</label>").appendTo($formPieceDiv);
            var formInput = $("<input type='text' name='new" + name + "' id='new" + name + "' value='" + bValue +"'/>").appendTo($formPieceDiv);            

            $formPieceDiv.appendTo($formForm);
        }
        
        createFormPiece("Name", bName);
        createFormPiece("Date", bDate);
        createFormPiece("Time", bTime);
        createFormPiece("Description", bDesc);
        
        
        var $cancelButton = $("<div>Back</dic>").click(function(){
            $newBack.remove();
        }).appendTo($newB);
        var $confirmButton = $("<input type='submit' value='Save'/>").appendTo($formForm);
        
        var $eraseButton = $("<div>Erase</div>").click(function(){
            $newBack.remove();
            $.post("php/eraseBooking.php",{bookingId:bId},function(data){
                JABA.Calendar.refresh(new Date(bDate));
            });
            
        }).appendTo($newB);
        
        
        $newB.prependTo($newBack);
        $newBack.prependTo("body");  
    });
    
    $("<p>Name: " + bName + "<br/> Time: " + bTime + " BookNr: " + bId + "<br/>Desc: " + bDesc + "</p>").appendTo(chosenRow);


};

JABA.Booking.BookingForm = function(ifNew){
        
        // skapa en div som ligger ovanpå allt
        var $newBack = $("<div id='newBack'></div>");
        
        // fyll diven med formuläret
        var $newB = $("<div id='newB'></div>");
        
        var postInfo = "";    
    
        if(ifNew){
            postInfo = "php/newBooking.php";
        } else {
            postInfo = "php/changeBooking.php";
        }
    
        var $formForm = $("<form action='" + postInfo + "' method='post'></form>");
        $formForm.appendTo($newB);
        
        function createFormPiece(name, place){
            var $formPieceDiv = $("<div></div>");
            
            var formLabel = $("<label for='new" + name +"'>" + name + "</label>").appendTo($formPieceDiv);
            var formInput = $("<input type='text' name='new" + name + "' id='new" + name + "' placeholder='"+place+"'/>").appendTo($formPieceDiv);            

            $formPieceDiv.appendTo($formForm);
        }
        
        createFormPiece("Name", "Name");
        createFormPiece("Date", "yyyy-mm-dd");
        createFormPiece("Time", "Time");
        createFormPiece("Description", "Description");
        
        
        var $cancelButton = $("<div>Back</dic>").click(function(){
            $newBack.remove();
        }).appendTo($newB);
        var $confirmButton = $("<input type='submit' value='Save'/>").appendTo($formForm);
        
        $newB.prependTo($newBack);
        $newBack.prependTo("body");        
        
};