"use strict";
$(document).ready(function(){
    refresh(new Date());
});

function refresh(updateDate){
    $("#menu, #dates, #calendar").empty();
    
    /* Knappar för att ändra mellan vecko- och månads-VY */
    var $weekButton = $("<div class='button'>Vecka</div>");
    $weekButton.appendTo("#menu");
    var $monthButton = $("<div class='button'>Månad</div>");
    $monthButton.appendTo("#menu");
    
    /* Knapp för att flippa till FÖREGÅENDE vecka */
    var $prevButton = $("<div class='button'>Prev</div>");
    $prevButton.click(function(){
        updateDate.setDate(updateDate.getDate() - 7);
        refresh(new Date(updateDate));        
    }).appendTo("#menu");
    
    /* Lägger till TILL-FRÅN - Datum-sträng OCH lägger till dagarna med datum i DAG-panelen */
    getDates(new Date(updateDate));
    
    /* Knapp för att flippa till NÄSTA vecka */
    var $nextButton = $("<div class='button'>Next</div>");
    $nextButton.click(function(){
        updateDate.setDate(updateDate.getDate() + 7);
        refresh(new Date(updateDate));        
    }).appendTo("#menu");
    
    /* Knapp för att flippa till AKTUELL vecka */
    var $todayButton = $("<div class='button'>Idag</div>");
    $todayButton.click(function(){
        refresh(new Date());        
    }).appendTo("#menu");
    
    /* Knapp för att göra ny BOKNING */
    var $newBookingButton = $("<div class='button'>Ny bokning</div>");
    $newBookingButton.click(function(){
        // skapa en div som ligger ovanpå allt
        var $newBack = $("<div id='newBack'>ny bookning div</div>");
        
        
        // fyll diven med formuläret
        var $newB = $("<div id='newB'></div>");
        
        var $formForm = $("<form action='newBooking.php' method='post'></form>");
        $formForm.appendTo($newB);
        
        function createFormPiece(name){
            var $formPieceDiv = $("<div></div>");
            
            var formLabel = $("<label for='new" + name +"'>" + name + "</label>").appendTo($formPieceDiv);
            var formInput = $("<input type='text' id='new" + name + "'/>").appendTo($formPieceDiv);            

            $formPieceDiv.appendTo($formForm);
        }
        
        createFormPiece("Name");
        createFormPiece("Date");
        createFormPiece("Time");
        createFormPiece("Description");
        
        
        var $cancelButton = $("<div>Cancel</dic>").click(function(){
            $newBack.remove();
        }).appendTo($newB);
        var $confirmButton = $("<input type='submit' name='submit'/>").appendTo($formForm);
        
        $newB.prependTo($newBack);
        $newBack.prependTo("body");
        
        
        
        
    }).appendTo("#menu");
    
    /* lägger till COLUMNER och RADER i kalendern  */
    getCalDivs();
    
    /* funktion för då en tid-ruta klickats */
    $("#calendar .column .row").click(function(){
        console.log($("#calendar .column .row").index(this));
    });
}

/* funktion som skapar TILL-FRÅN Datum-sträng och dagar med datum i DAG-panelen */
function getDates(chosenDate){
    
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
    
    $("#menu").append(tempDates);
    
}


/* funktion som skapar COLUMNER och RADER i kalendern  */
function getCalDivs(){
    
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
}





