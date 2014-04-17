"use strict";
$(function(){
    var $weekButton = $("<div class='button'>Vecka</div>");
    var $monthButton = $("<div class='button'>Månad</div>");
    var $prevButton = $("<div class='button'>Prev</div>");
    var $dateString = $("<div class='button'>"+ getMenuDateString(1) +"</div>");
    var $nextButton = $("<div class='button'>Next</div>");
    var $todayButton = $("<div class='button'>Idag</div>");
    var $newBookingButton = $("<div class='button'>Ny bokning</div>");
    var $thingsToAdd = $weekButton.add($monthButton).add($prevButton).add($dateString).add($nextButton).add($todayButton).add($newBookingButton);
    $("#menu").append($thingsToAdd);
    
    $("#dates").append(getMenuDateString(2));
});

function getMenuDateString(choice){
    var date = new Date('2014','03','01');
    
    var weekDate;
    var daysString = "";
    
    for( var i = 0; i < 7; i++){

        if(i == 0){
            date.setDate(date.getDate() - date.getDay() + 1);
        }
        
        else{
            date.setDate(date.getDate() + 1);
            daysString +=" ";
        }
        
        weekDate = new Date(date);
        daysString += weekDate.getDate();
        
        if(i == 0){
            var monDate = weekDate;
        }
        
        if(i == 6){
            var sunDate = weekDate;
        }
    }

    
    
    var month = ["Januari", "Februari", "Mars", "April", "Maj", "Juni", "Juli", "Augusti", "Spetember", "Oktober", "November", "December"];
    
    var dateString = monDate.getDate() + " " + month[monDate.getMonth()] + " " + monDate.getFullYear() + " - " + sunDate.getDate() + " " + month[sunDate.getMonth()] + " " + sunDate.getFullYear();
    
    
    if(choice == 1){
        return dateString;
    }
    


    
    if(choice == 2){
        
        return daysString;
    }
    
    
}


