"use strict";
var JABA = JABA || {};

JABA.Calendar = {
    refresh: function(updateDate){
        $("#menu, #dates, #calendar").empty();
        
        // ändra datum variablerna för första och sista datumet
        JABA.Calendar.firstDate.setDate(updateDate.getDate() - updateDate.getDay() + 1);
        JABA.Calendar.lastDate.setDate(updateDate.getDate() - updateDate.getDay() + 7);
                
        /* Knappar för att ändra mellan vecko- och månads-VY */
        var $weekButton = $("<div class='button'>Vecka</div>");
        $weekButton.appendTo("#menu");
        var $monthButton = $("<div class='button'>Månad</div>");
        $monthButton.appendTo("#menu");
        
        /* Knapp för att flippa till FÖREGÅENDE vecka */
        var $prevButton = $("<div class='button'>Prev</div>");
        $prevButton.click(function(){
            updateDate.setDate(updateDate.getDate() - 7);
            JABA.Calendar.refresh(new Date(updateDate));        
        }).appendTo("#menu");
        
        /* Lägger till TILL-FRÅN - Datum-sträng OCH lägger till dagarna med datum i DAG-panelen */
        JABA.Calendar.getDates(new Date(updateDate));
        
        /* Knapp för att flippa till NÄSTA vecka */
        var $nextButton = $("<div class='button'>Next</div>");
        $nextButton.click(function(){
            updateDate.setDate(updateDate.getDate() + 7);
            JABA.Calendar.refresh(new Date(updateDate));        
        }).appendTo("#menu");
        
        /* Knapp för att flippa till AKTUELL vecka */
        var $todayButton = $("<div class='button'>Idag</div>");
        $todayButton.click(function(){
            JABA.Calendar.refresh(new Date());        
        }).appendTo("#menu");
        
        /* Knapp för att göra ny BOKNING */
        var $newBookingButton = $("<div class='button'>Ny bokning</div>");
        $newBookingButton.click(function(){
            JABA.Booking.BookingForm(true)
        }).appendTo("#menu");
        
        /* lägger till COLUMNER och RADER i kalendern  */
        JABA.Calendar.getCalDivs();
        
        /* funktion för då en tid-ruta klickats */
        $("#calendar .column .row").click(function(){
            //console.log($("#calendar .column .row").index(this));        
        });
        
        $("#calendar .column").click(function(){
            //console.log($("#calendar .column").index(this));
        });
        
        JABA.Calendar.getAjaxBookings(updateDate);
    },
    
    
    
    getAjaxBookings: function(chosenDate){
    
        // ändra start datumet till senaste måndag och skapa sträng för databasen
        var fdate = new Date(chosenDate);
        fdate.setDate(fdate.getDate() - fdate.getDay() + 1);
        var stringFDate = fdate.getFullYear() + "/" + (fdate.getMonth() + 1) + "/" + fdate.getDate();
        
        // ändra slut datumet till kommande söndag och skapa sträng för databasen
        var ldate = new Date(fdate);
        ldate.setDate(ldate.getDate() + 6);
        var stringLDate = ldate.getFullYear() + "/" + (ldate.getMonth() + 1) + "/" + ldate.getDate();
        
        $.get("php/getBookings.php",{fDate:stringFDate, lDate:stringLDate},function(data){
            
            // för varje bokning inom datum-ramarna 
            $.each(data, function(i, n){
                
                // skicka med bId, bName, bDate, bTime, bDesc
                
                var aBooking = new JABA.Booking(n[0], n[1], n[2], n[3], n[4]);
    
            });
            
        }, 'json');
    },
    
    /* funktion som skapar TILL-FRÅN Datum-sträng och dagar med datum i DAG-panelen */
    getDates: function(chosenDate){
        
        // datum vi ändrar till
        var date = chosenDate;
        
        var tempDate;    
        var weekDate;
        
        // arrayer med veckodagar och månader på svenska
        var weekDay = ["Söndag", "Måndag", "Tisdag", "Onsdag", "Torsdag", "Fredag", "Lördag"];
        var month = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "Spetember", "Oktober", "November", "December"];
        
        for( var i = 0; i < 7; i++){
    
            if(i == 0){
                // ändra datum till senaste måndag
                date.setDate(date.getDate() - date.getDay() + 1);
            }
            
            else{
                // öka datumet med 1
                date.setDate(date.getDate() + 1);
            }
            
            // skapa nytt datum-objekt med det nya datumet        
            weekDate = new Date(date);
            
            // skapa en div med class button och lägg till den i #dates        
            tempDate = $("<div>"+ weekDay[weekDate.getDay()]  + " " +  weekDate.getDate() +"</div>");
            tempDate.addClass("seventhWidth");
            
            
            if(i == 0){
                var monDate = weekDate;
            }
            
            if(i == 6){
                var sunDate = weekDate;
            }
            
            // lägg till dag-diven i datum-panelen
            $("#dates").append(tempDate);
        }
        
        // skapa div med class button innehållande från - till datum och lägg till i #menu
        var tempDates = $("<div class='toFromDates'>" + monDate.getDate() + " " + month[monDate.getMonth()] + " " + monDate.getFullYear() + " - " + sunDate.getDate() + " " + month[sunDate.getMonth()] + " " + sunDate.getFullYear() + "</div>");
        
        tempDates.click(function(){
            
            // skapa en div som ligger ovanpå allt
            var $newBack = $("<div id='newBack'></div>");
            
            // fyll diven med formuläret
            var $newB = $("<div id='newB'></div>");
            
            var postInfo = "";    
        
            var $formForm = $("<form action='' method='get'></form>");
            
            $formForm.appendTo($newB);
            
            
            var datePickLabel = $("<label for='datePick'>Date:</label>").appendTo($formForm);
            var datePickInput = $("<input type='text' name='datePick' id='datePick' placeholder='yyyy-mm-dd'/>").appendTo($formForm);            
            
            
            var $cancelButton = $("<div>Back</dic>").click(function(){
                $newBack.remove();
            }).appendTo($newB);
            
            var $confirmButton = $("<div>Go to date</dic>").click(function(){
                $newBack.remove();
                JABA.Calendar.refresh(new Date(datePickInput.val()));
                
            }).appendTo($newB);
            
            $newB.prependTo($newBack);
            $newBack.prependTo("body"); 
        });
        
        $("#menu").append(tempDates);
        
    },
        
    /* funktion som skapar COLUMNER och RADER i kalendern  */
    getCalDivs: function(){
    
        var tempCol;
        var tempRow;
        
        for( var i = 0; i < 7; i++){
            
            tempCol = $("<div class='column'></div>");
            
            for( var j = 0; j < 10; j++){
                tempRow = $("<div class='row'></div>");            
                tempCol.append(tempRow);
            }
    
            $("#calendar").append(tempCol);
        }
    },
    
    firstDate : new Date(),
    lastDate : new Date()
};

$(document).ready(function(){
    JABA.Calendar.refresh(new Date());
});















