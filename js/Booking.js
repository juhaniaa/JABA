"use strict";
var JABA = JABA || {};

JABA.Booking = function(bId, bName, bDate, bTime, bDesc){
    
    var that = this;
    var rowChoice = bTime - 8;
    var colChoice = new Date(bDate).getDay() - 1; 
    var chosenRow = $("#calendar .column:eq("+colChoice+") .row").eq(rowChoice);
    chosenRow.addClass("appointed");
    chosenRow.click(function(){
        
        JABA.Booking.BookingForm(false, bId, bName, bDate, bTime, bDesc);
    });
    
    $("<p>Name: " + bName + "<br/> Time: " + bTime + " BookNr: " + bId + "<br/>Desc: " + bDesc + "</p>").appendTo(chosenRow);


};

JABA.Booking.BookingForm = function(ifNew, bId, bName, bDate, bTime, bDesc){
        
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
    
        function flagEmptyFields(){
            $("input:text").each(function(){

                if($(this).val() == ""){
                    $(this).addClass("notValid");
                }
            });
            
        }
        
    
        var $formForm = $("<form action='" + postInfo + "' id='changeForm' method='post'></form>");
        
        
        $formForm.submit(function(event){            
            
            flagEmptyFields()

            if($("input.notValid").length == 0){
                
                var $form = $(this);
                $.ajax({
                    type: $form.attr('method'),
                    url: $form.attr('action'),
                    data: $form.serialize()
                }).done(function(data){
                    if(Date.parse(data)){
                        
                        // funktionen körs då servern returnerar ett godkänt datum 
                        // efter att en bokning registrerates eller ändrats                        
                        JABA.Calendar.refresh(new Date(data));
                        new JABA.Message("Booking has been saved", "okMessage");
                    }else{
                        new JABA.Message("Something went wrong", "badMessage");
                    }
                    $newBack.remove();
                });
            } else { 
                // PLEASE ADD messages in form wich inform user of bad input in fields
                new JABA.Message("Bad form input this will be fixed", "badMessage");
            }                    
            
            event.preventDefault();
        });
                         
        $formForm.appendTo($newB);
                
        if(!ifNew){
            var $formLabelId = $("<label for='bookingId'>Booking Nr:</label>").appendTo($formForm);
            var $formBookingId = $("<input type='text' name='bookingId' value='"+bId+"' readonly='readonly'/>").appendTo($formForm);
        }
        
        function createFormPiece(name, bValue, bLength, bPattern, bHolder){
            var $formPieceDiv = $("<div></div>");
            
            var $formLabel = $("<label for='new" + name +"'>" + name + "</label>").appendTo($formPieceDiv);
            var $formInput = $("<input type='text' name='new" + name + "' id='new" + name + "' value='" + bValue +"' maxlength='" + bLength + "' placeholder='"+ bHolder +"'/>").appendTo($formPieceDiv);
            $formInput.change(function(){
                if($(this).val().match(bPattern)){
                    // ändra så att det går att skicka
                    $(this).removeClass("notValid");
                } else {
                    // ändra så att det inte går att skicka
                    $(this).addClass("notValid");
                }
            });
            

            $formPieceDiv.appendTo($formForm);
        }
        
        if(ifNew){            
            bName = "";
            bDate = "";
            bTime = "";
            bDesc = "";
        }
        
        createFormPiece("Name", bName, 30, /^[\w åäö]{5,20}$/, "Name");
        createFormPiece("Date", bDate, 10, /^(19|2[0-9])[0-9][0-9]-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, "yyyy-mm-dd");
        createFormPiece("Time", bTime, 2, /^([0-9]|[01][0-9]|2[0-3])$/, "Time");
        createFormPiece("Description", bDesc, 30, /^[\w åäö]{5,30}$/, "Description");
        
        
        
        var $cancelButton = $("<div>Back</dic>").click(function(){
            $newBack.remove();
        }).appendTo($newB);
        var $confirmButton = $("<input type='submit' value='Save'/>").appendTo($formForm);
        
        var $eraseButton = $("<div>Erase</div>").click(function(){
            $newBack.remove();
            $.post("php/eraseBooking.php",{bookingId:bId},function(data){
                JABA.Calendar.refresh(new Date(bDate));
            });
            
            new JABA.Message("Booking has been erased", "okMessage");
            
        }).appendTo($newB);
        
        
        $newB.prependTo($newBack);
        $newBack.prependTo("body");  
        
};