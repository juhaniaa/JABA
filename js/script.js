"use strict";
var JABA = JABA || {};

JABA.Calendar = {
    refresh: function(updateDate){
        $("#menu, #dates, #calendar").empty();
        
        var fdiff = 1;
        var ldiff = 7;
        
        // om söndag
        if(updateDate.getDay() == 0){
            fdiff = -6;
            ldiff = 0;
        }
        
        JABA.Calendar.firstDate.setFullYear(updateDate.getFullYear());
        JABA.Calendar.firstDate.setMonth(updateDate.getMonth());
        JABA.Calendar.firstDate.setDate(updateDate.getDate() - updateDate.getDay() + fdiff);
        
        JABA.Calendar.lastDate.setFullYear(updateDate.getFullYear());
        JABA.Calendar.lastDate.setMonth(updateDate.getMonth());
        JABA.Calendar.lastDate.setDate(updateDate.getDate() - updateDate.getDay() + ldiff);        
        
                
        /* Knappa för att visa lista på kommande bokningar */
        var $listButton = $("<div class='button'></div>").appendTo("#menu");
         $("<a href='#'>List</a>").click(function(event){
            event.preventDefault();
            JABA.Booking.BookingList();
        }).appendTo($listButton);
        
        /* Knapp för att göra ny BOKNING */
        var $newBookingButton = $("<div class='button'></div>").appendTo("#menu");        
        $("<a href='#'>New</a>").click(function(event){
            event.preventDefault();
            JABA.Booking.BookingForm(true);
        }).appendTo($newBookingButton);
        
        /* Knapp för att flippa till FÖREGÅENDE vecka */
        var $prevButton = $("<div class='button'></div>").appendTo("#menu");
        $("<a href='#'>Prev</a>").click(function(event){
            event.preventDefault();
            updateDate.setDate(updateDate.getDate() - 7);
            JABA.Calendar.refresh(new Date(updateDate));        
        }).appendTo($prevButton);
        
        /* Lägger till TILL-FRÅN - Datum-sträng OCH lägger till dagarna med datum i DAG-panelen */
        JABA.Calendar.getDates(new Date(updateDate));
        
        /* Knapp för att flippa till NÄSTA vecka */
        var $nextButton = $("<div class='button'></div>").appendTo("#menu");
        $("<a href='#'>Next</a>").click(function(event){
            event.preventDefault();
            updateDate.setDate(updateDate.getDate() + 7);
            JABA.Calendar.refresh(new Date(updateDate));        
        }).appendTo($nextButton);
        
        /* Knapp för att flippa till AKTUELL vecka */
        var $todayButton = $("<div class='button'></div>").appendTo("#menu");
        $("<a href='#'>Today</a>").click(function(event){
            event.preventDefault();
            JABA.Calendar.refresh(new Date());        
        }).appendTo($todayButton);
        
        /* Knapp för att göra ny BOKNING */
        var $settingsButton = $("<div class='button'></div>").appendTo("#menu");        
        $("<a href='#'>Settings</a>").click(function(event){
            event.preventDefault();
            JABA.Calendar.settingsForm();
        }).appendTo($settingsButton);
        
        /* funktion för då en tid-ruta klickats */
        $("#calendar .column .row").click(function(){
            //console.log($("#calendar .column .row").index(this));        
        });
        
        $("#calendar .column").click(function(){
            //console.log($("#calendar .column").index(this));
        });
        
        /* lägger till COLUMNER och RADER i kalendern  */
        JABA.Calendar.getCalDivs();
        
        JABA.Calendar.getAjaxBookings(updateDate);
        
      
    },
    
    
    
    getAjaxBookings: function(chosenDate){
            
        var stringFDate = JABA.Calendar.firstDate.getFullYear() + "/" + (JABA.Calendar.firstDate.getMonth() + 1) + "/" + JABA.Calendar.firstDate.getDate();
     
        var stringLDate = JABA.Calendar.lastDate.getFullYear() + "/" + (JABA.Calendar.lastDate.getMonth() + 1) + "/" + JABA.Calendar.lastDate.getDate();

        
        $.get("php/getBookings.php",{fDate:stringFDate, lDate:stringLDate},function(data){                       
        
            
            // för varje bokning inom datum-ramarna 
            $.each(data, function(i, n){
                                
                // skicka med bId, bName, bDate, bTime, bDesc                
                var aBooking = new JABA.Booking(n[0], n[1], n[2], n[3], n[4]);    
            });
            
        }, 'json');
    },
    
    /* funktion som skapar menyer och gör möjligt att fritt välja datum */
    getDates: function(chosenDate){
        
        // datum vi ändrar till
        var date = chosenDate;
    
        
        // arrayer med veckodagar och månader på engelska
        var weekDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        $("<div class='timeDate'>Time</div>").appendTo($("#dates"));
        
        for( var i = 0; i < 7; i++){
    
            if(i == 0){
                // börja på måndag
                date.setDate(JABA.Calendar.firstDate.getDate());
            }
            
            else{
                // öka datumet med 1
                date.setDate(date.getDate() + 1);
            }            

            // skriver ut tex Wednesday 25            
            var $dayText = $("<div>"+ weekDay[i]  + " " +  date.getDate() +"</div>").addClass("seventhWidth").appendTo($("#dates"));
            
            var today = new Date();
            
            if(date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth() && date.getDate() == today.getDate()){
                $dayText.addClass("todayMarking");
            }
            
        }
        
        var monDate = JABA.Calendar.firstDate;
        var sunDate = JABA.Calendar.lastDate;
        
        // skapa div med class button innehållande från - till datum och lägg till i #menu
        var tempDates = $("<div class='toFromDates'></div>");
        
        $("<a href='#'>"+monDate.getDate() + " " + month[monDate.getMonth()] + " " + monDate.getFullYear() + " - " + sunDate.getDate() + " " + month[sunDate.getMonth()] + " " + sunDate.getFullYear()+"</a>").click(function(event){
            
            event.preventDefault();
            
            // skapa en div som ligger ovanpå allt
            var $newBack = $("<div id='newBack'></div>");
            
            // fyll diven med formuläret
            var $newB = $("<div id='newB'></div>");
        
            var $formForm = $("<form action='' method='post'></form>");
            
            $formForm.appendTo($newB);            
            
            var $datePickLabel = $("<label for='datePick'>Date:</label>").appendTo($formForm);
            var $datePickInput = $("<input type='text' name='datePick' id='datePick' placeholder='yyyy-mm-dd' maxlength='10'/>").appendTo($formForm);
            
            $datePickInput.addClass("notValid");
            var bPattern = /^(19|2[0-9])[0-9][0-9]-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/;
            
            
            $datePickInput.change(function(){

                if($datePickInput.val().match(bPattern)){
                    // ändra så att det går att skicka
                    $datePickInput.removeClass("notValid");
                    $datePickLabel.text("Date: ");
                    $datePickLabel.removeClass("invLabel");
                } else {
                    // ändra så att det inte går att skicka                    
                    $datePickInput.addClass("notValid");
                    $datePickLabel.text("Date: use 'yyyy-mm-dd' format");
                    $datePickLabel.addClass("invLabel");
                }
            });
                        
            var $cancelButton = $("<div></div>").appendTo($newB);
            $("<a href='#'>Back</a>").click(function(event){
                event.preventDefault();
                $newBack.remove();
            }).appendTo($cancelButton);
            
            $formForm.submit(function(event){
                
                event.preventDefault();
                
                if($("input.notValid").length == 0){             
                    JABA.Calendar.refresh(new Date($datePickInput.val()));
                    $newBack.remove();   
                }
                
                else{
                    $datePickLabel.text("Date: use 'yyyy-mm-dd' format");
                    $datePickLabel.addClass("invLabel");
                }
            });
            
            var $confirmButton = $("<div></div>").appendTo($newB)
            $("<a href='#'>Go to date</a>").click(function(event){                
                event.preventDefault();                
                $formForm.submit();                    
            }).appendTo($confirmButton);;
            
            $newB.prependTo($newBack);
            $newBack.prependTo("body"); 
        }).appendTo(tempDates);
        
        $("#menu").append(tempDates);
        
    },
        
    /* funktion som skapar COLUMNER och RADER i kalendern  */
    getCalDivs: function(){
        
        /* skapa TIDscolumn och rows */
        var tempTimeCol = $("<div class='timeCol'></div>").appendTo($("#calendar"));
        
        
        for( var j = 0; j < 10; j++){
            $("<div class='timeRow'>"+(j+8)+"</div>").appendTo(tempTimeCol);     
        }
                    
        var tempCol;     
        
        for( var i = 0; i < 7; i++){
            
            tempCol = $("<div class='column'></div>");
            
            for( var j = 0; j < 10; j++){
                $("<div class='row'></div>").appendTo(tempCol);            
                
            }
    
            $("#calendar").append(tempCol);
        }
    },
    
    settingsForm: function(){
        
        // skapa en div som ligger ovanpå allt
        var $newBack = $("<div id='newBack'></div>").prependTo("body");;
                
        // listan läggs till i $newB
        var $newB = $("<div id='newB'></div>").prependTo($newBack);   
    
        var $settingsDiv = $("<div></div>").appendTo($newB);
        $("<a href='#'>Log Out</a>").click(function(){
            $.get("php/loginStop.php",{},function(data){                                
                window.location.replace("login.html");
            });
        }).appendTo($settingsDiv);; 
        
        var $closeButton = $("<div></div>").appendTo($newB);
        $("<a href='#'>Close</a>").click(function(event){
            event.preventDefault();
            $newBack.remove();
        }).appendTo($closeButton); 
    
        
    },
    
    firstDate : new Date(),
    lastDate : new Date()
};

$(document).ready(function(){
    JABA.Calendar.refresh(new Date());
});















