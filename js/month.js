"use strict";
var JABA = JABA || {};

JABA.Month = {
    refreshMonth: function(updateDate){
        $("#menu, #dates, #calendar").empty();
        JABA.Month.myArrays = [];                
                        
        /* Knappa för att visa lista på kommande bokningar */
        var $listButton = $("<div class='button'></div>").appendTo("#menu");
         $("<a href='#'></a>").addClass("list").click(function(event){
            event.preventDefault();
            JABA.Booking.BookingList();
        }).appendTo($listButton);
        
        /* Knapp för att göra ny BOKNING */
        var $newBookingButton = $("<div class='button'></div>").appendTo("#menu");        
        $("<a href='#'></a>").addClass("new").click(function(event){
            event.preventDefault();
            JABA.Booking.BookingForm(false,"","","","","", true);
        }).appendTo($newBookingButton);
        
        /* Knapp för att flippa till FÖREGÅENDE månad */
        var $prevButton = $("<div class='button'></div>").appendTo("#menu");
        $("<a href='#'></a>").addClass("prev").click(function(event){
            event.preventDefault();
            updateDate.setMonth(updateDate.getMonth() - 1);
            JABA.Month.refreshMonth(new Date(updateDate));        
        }).appendTo($prevButton);
        
        /* Lägger till TILL-FRÅN - Datum-sträng OCH lägger till dagarna med datum i DAG-panelen */
        JABA.Month.getDates(new Date(updateDate));
        
        
        /* Knapp för att flippa till NÄSTA månad */
        var $nextButton = $("<div class='button'></div>").appendTo("#menu");
        $("<a href='#'></a>").addClass("next").click(function(event){
            event.preventDefault();
            updateDate.setMonth(updateDate.getMonth() + 1);
            JABA.Month.refreshMonth(new Date(updateDate));        
        }).appendTo($nextButton);
        
        /* Knapp för att flippa till AKTUELL Månad */
        var $todayButton = $("<div class='button'></div>").appendTo("#menu");
        $("<a href='#'></a>").addClass("today").click(function(event){
            event.preventDefault();
            JABA.Month.refreshMonth(new Date());        
        }).appendTo($todayButton);
        
        /* Knapp för att göra ändra INSTÄLLNINGAR */
        var $settingsButton = $("<div class='button'></div>").appendTo("#menu");        
        $("<a href='#'></a>").addClass("setting").click(function(event){
            event.preventDefault();
            JABA.Calendar.settingsForm(updateDate);
        }).appendTo($settingsButton);
        
        
        JABA.Month.getAjaxBookings(updateDate);
        
        /* lägger till COLUMNER och RADER i kalendern  */
        JABA.Month.getCalDivs(updateDate);    
    },
    
    
    
    getAjaxBookings: function(chosenDate){
        
        var theDate = new Date(chosenDate);
        
        var firstDay = new Date(theDate.getFullYear(), theDate.getMonth(), 1).getDay();
        var lastDay = new Date(theDate.getFullYear(), theDate.getMonth() + 1, 0).getDate();
            
        var stringFDate = theDate.getFullYear() + "/" + (theDate.getMonth() + 1) + "/1";
     
        var stringLDate = theDate.getFullYear() + "/" + (theDate.getMonth() + 1) + "/" + lastDay;                
        
        for(var k = 0; k < 32; k++){
            
            JABA.Month.myArrays.push({
                bookings: []
            });            
        }        
        
        $.get("php/getBookings.php",{fDate:stringFDate, lDate:stringLDate},function(data){                       
                        
            // för varje bokning inom datum-ramarna 
            $.each(data, function(i, n){        
                
                // datumet för bokningen                
                var getDate = new Date(n[2]).getDate();                
                
                var pushedArray = [n[0], n[1], n[2], n[3], n[4]];

                // har nu array med objekt där varje objekt innehåller
                // en array bookings som innehåller alla den dagens bokningar
                JABA.Month.myArrays[getDate].bookings.push(pushedArray);                
            });
            
        }, 'json').done(function(){
            
            JABA.Month.getMonthColors(chosenDate);
        });
    },
    
    /* funktion som skapar menyer och gör möjligt att fritt välja datum */
    getDates: function(chosenDate){
        
        // datum vi ändrar till
        var date = chosenDate;
            
        // arrayer med veckodagar och månader på engelska
        var weekDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        $("<div class='timeDate'>Week</div>").appendTo($("#dates"));
        
        // 7 columner med veckodagar
        for(var i = 0; i < 7; i ++){
            var $text = $("<div>"+weekDay[i]+"</div>").addClass("monthWidth").appendTo($("#dates"));
        }
                
        
        // skapa div med class button innehållande från - till datum och lägg till i #menu
        var tempDates = $("<div class='monthDates'></div>");
        
        $("<a href='#'>"+month[chosenDate.getMonth()]+ " "+ chosenDate.getFullYear() +"</a>").click(function(event){
            
            event.preventDefault();
            
            // skapa en div som ligger ovanpå allt
            var $newBack = $("<div id='newBack'></div>");
            
            // fyll diven med formuläret
            var $newB = $("<div id='newB'></div>");
        
            $("<h2>Choose Date</h2>").appendTo($newB);
            
            var $formForm = $("<form action='' method='post'></form>");
            
            $formForm.appendTo($newB);            
            
            var $datePickLabel = $("<label for='datePick'>Date:</label>").appendTo($formForm);
            var $datePickInput = $("<input type='text' name='datePick' id='datePick' placeholder='yyyy-mm-dd' maxlength='10'/>").appendTo($formForm);
            
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
            
            var tempMode = "";
            
            $formForm.submit(function(event){
                
                event.preventDefault();
                var toDate = $datePickInput.val();
                
                if($("input.notValid").length == 0){  
                    if(toDate == ""){
                        toDate = chosenDate;
                        console.log(toDate);
                    }
                    if(tempMode == "Week"){
                        JABA.Calendar.refresh(new Date(toDate));                        
                    } else if(tempMode == "Month"){
                        JABA.Month.refreshMonth(new Date(toDate));
                    }
                    $newBack.remove();   
                }
                
                else{
                    $datePickLabel.text("Date: use 'yyyy-mm-dd' format");
                    $datePickLabel.addClass("invLabel");
                }
            });
            
             var $weekButton = $("<div></div>").appendTo($newB)
            $("<a href='#'></a>").addClass("btnWeek").click(function(event){                
                event.preventDefault();
                tempMode = "Week";
                //JABA.Calendar.mode = "Week";
                $formForm.submit();                    
            }).appendTo($weekButton);
            
            var $monthButton = $("<div></div>").appendTo($newB)
            $("<a href='#'></a>").addClass("btnMonth").click(function(event){                
                event.preventDefault();  
                tempMode = "Month";
                //JABA.Calendar.mode = "Month";
                $formForm.submit();                    
            }).appendTo($monthButton);
            
            var $cancelButton = $("<div></div>").appendTo($newB);
            $("<a href='#'></a>").addClass("btnClose").click(function(event){
                event.preventDefault();
                $newBack.remove();
            }).appendTo($cancelButton);
            
            $newB.prependTo($newBack);
            $newBack.prependTo("body"); 
        }).appendTo(tempDates);
        
        $("#menu").append(tempDates);
        
    },
        
    /* funktion som skapar COLUMNER och RADER i kalendern  */
    getCalDivs: function(chosenDate){
        
        var theDate = new Date(chosenDate);
        
        var firstDay = new Date(theDate.getFullYear(), theDate.getMonth(), 1).getDay();
        var lastDay = new Date(theDate.getFullYear(), theDate.getMonth() + 1, 0).getDate();
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];                         
        
        // om söndag
        if(firstDay == 0){
            firstDay = 7;
        }
        
        JABA.Month.firstDay = firstDay;
        JABA.Month.lastDay = lastDay;
        
        var number;
        var iterations = 37;
        var cols = 5;
        
        
        // om en månad ingår i 6 olika veckor
        if(firstDay + lastDay -1 > 35){
            iterations = iterations + 7;
            cols = 6;            
        }
        
        // om en månad endast ingår i 4 veckor
        if(firstDay + lastDay -1 < 29){
            iterations = iterations -7;
            cols = 4;            
        }
        
        var colHeight = cols * 60;   
        
        JABA.Month.iterations = iterations;                                
        
        
        $("#calendar").height(colHeight);
        
        var tempTimeCol = $("<div class='timeCol'></div>").height(colHeight).appendTo($("#calendar"));        
        
        var firstJan = new Date(theDate.getFullYear(),0,1);
                
        var firsDayOfMonth = new Date(theDate.getFullYear(), theDate.getMonth(), 1);
        
        var daysDiff = (firsDayOfMonth.getTime() - firstJan.getTime())/86400000;        
        
        var firstWeek = Math.ceil((daysDiff - firstDay +10)/7);
        
        for( var j = 0; j < cols; j++){
            $("<div class='timeRow'>v."+ (firstWeek + j) +"</div>").appendTo(tempTimeCol);     
        }
        
        // skapa en mängd divs som floatar
        for(var j = 2; j < iterations; j++){
            
            number = j - firstDay;
            
            if(number < 1 || number > lastDay){
                number = "";
              
            } 
            
            var $monthDiv = $("<div class='monthDay' ></div>").appendTo("#calendar");
            $("<a href='#' data-number='"+number+"'>" + number + "</a>").click(function(event){
                event.preventDefault();
                $(".isActiveDay").removeClass("isActiveDay");
                $(this).parent().addClass("isActiveDay");
                
                if($.isNumeric($(this).data('number'))){
                    
                    $("#lastOne").remove();
                    $("#whiteSpace").remove();
                    var $whiteSpace = $("<div id='whiteSpace'></div>").appendTo("#calendar");
                    var $ulList = $("<ul id='lastOne'><h2>Bookings "+$(this).data('number')+ " " + month[theDate.getMonth()] +"</h2></ul>").appendTo("#calendar");
                    
                    
                    if(JABA.Month.myArrays[$(this).data('number')].bookings.length == 0){
                        $("<h3>No bookings yet</h3>").appendTo($ulList);
                    }
                    
                    var $that = $(this);
                    
                    // varje gång den körs innehåller $(this) en array som representerar en bokning
                    $.each(JABA.Month.myArrays[$(this).data('number')].bookings, function(index, value){
                        
                        var $myList = $("<li><p>"+$(this)[3]+":00</p></li>").appendTo($ulList);
                        
                        var bNr = $(this)[0];
                        var bName = $(this)[1];
                        var bDate = $(this)[2];
                        var bTime = $(this)[3];
                        var bDesc = $(this)[4];
                        
                        
                        $("<a href='#'>Name: "+$(this)[1]+"</br>Desc: "+$(this)[4] +"</a>").addClass('isBookedDay').click(function(event){
                            event.preventDefault();
                            JABA.Booking.BookingForm(true, bNr, bName, bDate, bTime, bDesc, true, $that.data("number"));
                        }).appendTo($myList);
                        
                       
                        /*
                        0 innehåller bokningsnummer
                        1 namn
                        2 datum
                        3 tid
                        4 desc
                        */
                    });
                    
                    var $newLi = $("<li></li>").appendTo($ulList);
                    number = $(this).data('number');
                    if(number < 10){
                        number = "0" + number;
                    }
                    var monthDate = chosenDate.getMonth() + 1;
                    if(monthDate < 10){
                        monthDate = "0" + monthDate;
                    }
                    $("<a href='#' data-date='"+number+"'></a>").addClass("btnNew").click(function(event){
                        event.preventDefault();
                        var dateString = chosenDate.getFullYear() + "-" + monthDate + "-" + $(this).data("date");
                        JABA.Booking.BookingForm(false,"","",dateString,"","", true, $(this).data("date"));
                    }).appendTo($newLi);
                }
            }).appendTo($monthDiv);
            
            if($.isNumeric(number)){
                
                
                if(JABA.Month.myArrays[number].bookings.length > 0){
                    $monthDiv.addClass('isBookedDay');
                } else{                
                    $monthDiv.addClass('isDayOfMonth');
                }                
            }                                    
        }                
    },
    
    getMonthColors: function(chosenDate){
        
        var todayDate = new Date();
        
        var number;
        var iterations = JABA.Month.iterations;        
        
        var firstDay = JABA.Month.firstDay;
        var lastDay = JABA.Month.lastDay;
        
        for(var j = 2; j < iterations; j++){
            
            number = j - firstDay;
            
            if(number < 1 || number > lastDay){
                number = "";              
            }                         
            
            if($.isNumeric(number)){    
                
               
                
                if(new Date(chosenDate.getFullYear(), chosenDate.getMonth(), number).setHours(0,0,0,0) == todayDate.setHours(0,0,0,0)){
                    $("a[data-number="+number+"]").parent().addClass('isTodayDay');                    
                }
                
                if(JABA.Month.myArrays[number].bookings.length > 0){
                    $("a[data-number="+number+"]").parent().addClass('isBookedDay');
                    
                } else{                
                    $("a[data-number="+number+"]").parent().addClass('isDayOfMonth');
                    
                }                
            }                                    
        }
    },
    
    settingsForm: function(updateDate){
        
        alert("Im never used, I think");
        // skapa en div som ligger ovanpå allt
        var $newBack = $("<div id='newBack'></div>").prependTo("body");;
                
        // listan läggs till i $newB
        var $newB = $("<div id='newB'></div>").prependTo($newBack); 
        $("<h2>Settings</h2>").appendTo($newB);
        var $startValue = $("<div></div>").appendTo($newB);
        $("<label>Start Tid</label>").appendTo($startValue);
        var $startInput = $("<input type='number' min='0' max='23' value='"+JABA.Calendar.startTime+"'>").appendTo($startValue);
        
        var $endValue = $("<div></div>").appendTo($newB);
        var $slutLabel = $("<label>Slut Tid</label>").appendTo($endValue);
        var $endInput = $("<input type='number' min='0' max='23' value='"+JABA.Calendar.endTime+"'>").appendTo($endValue);
    
        var $settingsDiv = $("<div></div>").appendTo($newB);
        $("<a href='#'></a>").addClass("btnSave").click(function(event){
            event.preventDefault();
            
            if(parseInt($startInput.val()) < parseInt($endInput.val())){
                $.post("php/optionsSet.php",{startTime: $startInput.val(), endTime: $endInput.val()},function(data){        
                    $newBack.remove();                                                                                  
                    JABA.Calendar.getSettings();                                                                                
                    JABA.Calendar.refresh(new Date(updateDate));
                    
                });
            } else{
                $slutLabel.addClass("invLabel");
                $slutLabel.text("Slut Tid måste vara > StartTid"); 
            }
        }).appendTo($settingsDiv);
        
        var $LogOutDiv = $("<div></div>").appendTo($newB);
        $("<a href='#'></a>").addClass("btnLogOut").click(function(event){
            event.preventDefault();
            $.get("php/loginStop.php",{},function(data){                                
                window.location.replace("login.html");
            });
        }).appendTo($LogOutDiv);
        
        var $closeButton = $("<div></div>").appendTo($newB);
        $("<a href='#'></a>").addClass("btnClose").click(function(event){
            event.preventDefault();
            $newBack.remove();
        }).appendTo($closeButton); 
    
        
    },
    
    lastDay: 1,
    firstday: 1,
    iterations: 37,    
    startTime:4,
    endTime:17,
    myArrays:[]
};
















