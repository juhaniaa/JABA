"use strict";
var JABA = JABA || {};

JABA.Booking = function(bId, bName, bDate, bTime, bDesc){
    
    var that = this;
    var rowChoice = bTime - 8;
    var colChoice = new Date(bDate).getDay() - 1; 
    var chosenRow = $("#calendar .column:eq("+colChoice+") .row").eq(rowChoice);
    chosenRow.addClass("appointed");
    
    
    $("<a href='#'>Time: " + bTime + " BookNr: " + bId + "<br/>Name: " + bName + "<br/>Desc: " + bDesc + "</a>").click(function(event){  
        event.preventDefault();
        JABA.Booking.BookingForm(false, bId, bName, bDate, bTime, bDesc);
    }).appendTo(chosenRow);
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
                    $formLabel.text(name);
                    $formLabel.removeClass("invLabel");
                } else {
                    // ändra så att det inte går att skicka
                    $(this).addClass("notValid");
                    $formLabel.text(name + " bad format");
                    $formLabel.addClass("invLabel");
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
        
        createFormPiece("Name", bName, 20, /^[\w åäöÅÄÖ]{5,20}$/, "Name");
        createFormPiece("Date", bDate, 10, /^(19|2[0-9])[0-9][0-9]-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, "yyyy-mm-dd");
        createFormPiece("Time", bTime, 2, /^([0-9]|[01][0-9]|2[0-3])$/, "Time");
        createFormPiece("Description", bDesc, 30, /^[\w åäöÅÄÖ]{5,30}$/, "Description");
        
        
        var $cancelButton = $("<div></div>").appendTo($newB);
        $("<a href='#'>Back</a>").click(function(event){
            event.preventDefault();
            $newBack.remove();
        }).appendTo($cancelButton);
    
        
    
        var $cancelButton2 = $("<div></div>").appendTo($newB);
    
        $("<a href='#'>Save</a>").click(function(event){
            event.preventDefault();
            $formForm.submit();
        }).appendTo($cancelButton2);
        
        if(!ifNew){
            var $eraseButton = $("<div></div>").appendTo($newB);    
            $("<a href='#'>Erase</a>").click(function(event){
                event.preventDefault();
                $newBack.remove();
                $.post("php/eraseBooking.php",{bookingId:bId},function(data){
                    JABA.Calendar.refresh(new Date(bDate));
                });            
                new JABA.Message("Booking has been erased", "okMessage");            
            }).appendTo($eraseButton);
        }
        
        
        $newB.prependTo($newBack);
        $newBack.prependTo("body");  
        
};

JABA.Booking.BookingList = function(){
        
        // skapa en div som ligger ovanpå allt
        var $newBack = $("<div id='newBack'></div>").prependTo("body");;
                
        // listan läggs till i $newB
        var $newB = $("<div id='bookingList'></div>").prependTo($newBack);   
    
        var fromDate = new Date();
    
        var dateString = fromDate.getFullYear() + "/" + (fromDate.getMonth() + 1) + "/" + fromDate.getDate();
    
        $.get("php/getList.php",{fDate:dateString},function(data){                       
            
            $("<h2>Upcoming Bookings</h2>").appendTo($newB);
                    
            // för varje bokning inom datum-ramarna 
            $.each(data, function(i, n){
                
                                
                //  bId, bName, bDate, bTime, bDesc   n[0], n[1], n[2], n[3], n[4]);  
                var $listDiv = $("<div class='listDiv'></div>").addClass("appointed").appendTo($newB);
                $("<a href='#'>Date: " + n[2] + " Time: " + n[3] + " BookNr: " + n[0] + "</br>Name: " + n[1] + "</br>Desc: " + n[4] + "</a>").click(function(event){
                    event.preventDefault();
                    $newBack.remove();
                    JABA.Booking.BookingForm(false, n[0], n[1], n[2], n[3], n[4]);
                }).appendTo($listDiv);
                                
            });
            
            var $closeButton = $("<div></div>").appendTo($newB);
            $("<a href='#'>Close</a>").click(function(event){
                event.preventDefault();
                $newBack.remove();
            }).appendTo($closeButton); 
            
        }, 'json');
                
        
                      
        
};