"use strict";
var JABA = JABA || {};

JABA.Calendar = {
    // uppdaterar kalendern till valt datum utifrån satt inställning antingen vecka eller månad
    refresh: function(updateDate){
        
        $("#menu, #dates, #calendar").empty();        
        
        JABA.Calendar.monthBookingsArr = [];                             
        
        /* Hämtar veckans datum */
        JABA.Calendar.getWeekDates(updateDate);        
        
        /* Lägger till menyn */
        JABA.Calendar.addMenu(updateDate);                                    
        
        if(JABA.Calendar.mode == "Month"){
                            
            /* Hämtar bokningarna och lägger till i monthBookingsArr */
            JABA.Calendar.getMonthBookings(updateDate);
            
            /* lägger till COLUMNER och RADER med bokningarna ur monthBookingsArr i kalendern  */
            JABA.Calendar.getMonthDivs(updateDate); 
                        
        } else{                                                                                        
                        
            /* Lägger till COLUMNER och RADER i kalendern  */
            JABA.Calendar.getWeekDivs();
            
            /* Lägger till bokningarna ur daysOfWeek arrayen i kalendern */
            JABA.Calendar.getWeekBookings(updateDate);            
        }
    },
    
    // tilldelar veckans datum utifrån givet datum
    getWeekDates: function(chosenDate){
    
        var diff = 0;
        
        // om söndag
        if(chosenDate.getDay() == 0){
            diff = -7;
        }
        
        var atmDate = new Date(chosenDate.getFullYear(), chosenDate.getMonth(), chosenDate.getDate() - chosenDate.getDay() + diff);
        
        var year;
        var month;
        var day;
        
        for( var i = 0; i < 7; i++){
                        
            atmDate = new Date(atmDate.getFullYear(), atmDate.getMonth(), atmDate.getDate() + 1);                           
            
            year = atmDate.getFullYear();
            month = atmDate.getMonth() + 1;
            day = atmDate.getDate();
            
            if(month < 10){
                month = "0" + month;            
            }
            
            if(day < 10){
                day = "0" + day;
            }
                        
            JABA.Calendar.daysOfWeek[i].year = year.toString();
            JABA.Calendar.daysOfWeek[i].month = month.toString();
            JABA.Calendar.daysOfWeek[i].day = day.toString();                        
        }                
    },
    
    // UNDER KONSTRUKTION används ej
    getMonthDates: function(chosenDate){
        for(var k = 0; k < 32; k++){
            
            JABA.Calendar.daysOfMonth.push({
                bookings: [],
            });            
        }  
    },
              
    // lägger till menyn
    addMenu: function(updateDate){
        
        var nextDate;
        var prevDate;
        
        // olika updateringsdatum beroende på läge
        if(JABA.Calendar.mode == "Month"){
            prevDate = new Date(updateDate.getFullYear(), (updateDate.getMonth() - 1));   
            nextDate = new Date(updateDate.getFullYear(), updateDate.getMonth() + 1);
        } else if(JABA.Calendar.mode == "Week") {
            prevDate = new Date(updateDate.getFullYear(), updateDate.getMonth(), (updateDate.getDate() - 7));
            nextDate = new Date(updateDate.getFullYear(), updateDate.getMonth(), updateDate.getDate() + 7);
        }        
        
        // Lista med bokningar
        JABA.Calendar.addClickBtn("#menu", "list", JABA.Booking.BookingList, "");    
        
        // Ny bokning
        JABA.Calendar.addClickBtn("#menu", "new", JABA.Booking.BookingForm, false);    
            
        // Tdigare vecka/månad
        JABA.Calendar.addClickBtn("#menu", "prev", JABA.Calendar.refresh, prevDate);
        
        // Lägger till datumknappen
        JABA.Calendar.addMenuDates(updateDate);                
        
        // Näst vecka/månad        
        JABA.Calendar.addClickBtn("#menu", "next", JABA.Calendar.refresh, nextDate); 
            
        // Till dagens datum
        JABA.Calendar.addClickBtn("#menu", "today", JABA.Calendar.refresh, new Date());
                
        // Inställningar
        JABA.Calendar.addClickBtn("#menu", "btnSetting", JABA.Calendar.settingsForm, updateDate);
    },    
    
    // MONTH lägger till knappen med datum
    addMonthMenuDates: function(chosenDate){
        
        // datum vi ändrar till
        //var date = chosenDate;
        var menuClass;
        var datesStr;
            
        // arrayer med veckodagar och månader på engelska
        var weekDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        $("<div class='timeDate'>Week</div>").appendTo($("#dates"));
        
        // 7 columner med veckodagar
        for(var i = 0; i < 7; i ++){
            var $text = $("<div>"+weekDay[i]+"</div>").addClass("monthWidth").appendTo($("#dates"));
        }
        
        menuClass = "monthDates";        
        datesStr = month[chosenDate.getMonth()]+ " "+ chosenDate.getFullYear();
        
        // skapa div med class button innehållande från - till datum och lägg till i #menu
        var menuDates = $("<div></div>").addClass(menuClass).appendTo("#menu");

        $("<a href='#'>"+ datesStr +"</a>").click(function(event){
            event.preventDefault();            
            JABA.Calendar.goToDate(chosenDate);                        
        }).appendTo(menuDates);  
 
    },
    
    // MONTH hämtar ut bokningarna för aktuell månad från databasen
    getMonthBookings: function(chosenDate){
        
        var theDate = new Date(chosenDate);
        
        var firstDay = new Date(theDate.getFullYear(), theDate.getMonth(), 1).getDay();
        var lastDay = new Date(theDate.getFullYear(), theDate.getMonth() + 1, 0).getDate();
            
        var stringFDate = theDate.getFullYear() + "/" + (theDate.getMonth() + 1) + "/1";
     
        var stringLDate = theDate.getFullYear() + "/" + (theDate.getMonth() + 1) + "/" + lastDay;                
        
        for(var k = 0; k < 32; k++){
            
            JABA.Calendar.monthBookingsArr.push({
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
                JABA.Calendar.monthBookingsArr[getDate].bookings.push(pushedArray);                
            });
            
        }, 'json').done(function(){
            
            JABA.Calendar.setMonthColors(chosenDate);
        });
    },
    
    // MONTH funktion som skapar COLUMNER och RADER i kalendern
    getMonthDivs: function(chosenDate){
        
        var theDate = new Date(chosenDate);
        
        var firstDay = new Date(theDate.getFullYear(), theDate.getMonth(), 1).getDay();
        var lastDay = new Date(theDate.getFullYear(), theDate.getMonth() + 1, 0).getDate();
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];                         
        
        // om söndag
        if(firstDay == 0){
            firstDay = 7;
        }
        
        JABA.Calendar.firstDay = firstDay;
        JABA.Calendar.lastDay = lastDay;
        
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
        
        JABA.Calendar.iterations = iterations;                                
        
        
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
                    
                    
                    if(JABA.Calendar.monthBookingsArr[$(this).data('number')].bookings.length == 0){
                        $("<h3>No bookings yet</h3>").appendTo($ulList);
                    }
                    
                    var $that = $(this);
                    
                    // varje gång den körs innehåller $(this) en array som representerar en bokning
                    $.each(JABA.Calendar.monthBookingsArr[$(this).data('number')].bookings, function(index, value){
                        
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
                
                
                if(JABA.Calendar.monthBookingsArr[number].bookings.length > 0){
                    $monthDiv.addClass('isBookedDay');
                } else{                
                    $monthDiv.addClass('isDayOfMonth');
                }                
            }                                    
        }                
    },
    
    // WEEK lägger till veckans dagar och datum i rubrik-menyn
    addHeaderDates: function(){
        
        $("<div>Time</div>").addClass("timeDate").appendTo($("#dates"));        
        
        var today = new Date();
        
        JABA.Calendar.todayColNr = "";
        
        for( var i = 0; i < 7; i++){
            
            var day = JABA.Calendar.daysOfWeek[i];
            
            var $dateText = $("<div>" + day.dayStr + " " + day.day + "</div>").addClass("seventhWidth").appendTo($("#dates"));
                        
            if(day.year == today.getFullYear() && day.month == today.getMonth() + 1 && parseInt(day.day) == today.getDate()){                

                $dateText.addClass("todayMarking");  
                
                JABA.Calendar.todayColNr = i;
            }  
        }
    },
    
     // WEEK lägger till ruta med aktuella datum
    addMenuDates: function(updateDate){
        
        var month = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var menuClass;
        var datesStr;
        
        
        if(JABA.Calendar.mode == "Week"){
            
            var fDay = JABA.Calendar.daysOfWeek[0].day;        
            var fMonth = month[parseInt(JABA.Calendar.daysOfWeek[0].month)];
            var fYear = JABA.Calendar.daysOfWeek[0].year;
            
            var tDay = JABA.Calendar.daysOfWeek[6].day;
            var tMonth = month[parseInt(JABA.Calendar.daysOfWeek[6].month)];
            var tYear = JABA.Calendar.daysOfWeek[6].year;
            
            
            menuClass = "toFromDates";
            datesStr = fDay + " " + fMonth + " " + fYear + " -</br>" + tDay + " " + tMonth + " " + tYear;
            
            JABA.Calendar.addHeaderDates();
            
        } else if(JABA.Calendar.mode == "Month"){
            
            // arrayer med veckodagar och månader på engelska
            var weekDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];            
            
            $("<div class='timeDate'>Week</div>").appendTo($("#dates"));
            
            // 7 columner med veckodagar
            for(var i = 0; i < 7; i ++){
                var $text = $("<div>"+weekDay[i]+"</div>").addClass("monthWidth").appendTo($("#dates"));
            }
            
            menuClass = "monthDates";
            datesStr = month[updateDate.getMonth() + 1] + " " + updateDate.getFullYear();
        }
        
        var menuDates = $("<div></div>").addClass(menuClass).appendTo("#menu");
        
        $("<a href='#'>" + datesStr + "</a>").click(function(event){
            event.preventDefault();
            JABA.Calendar.goToDate(updateDate);
        }).appendTo(menuDates);
    },
    
    // WEEK lägger till bokningar i veckovyn
    getWeekBookings: function(chosenDate){
        
        var fYear = JABA.Calendar.daysOfWeek[0].year;
        var fMonth = JABA.Calendar.daysOfWeek[0].month;
        var fDay = JABA.Calendar.daysOfWeek[0].day;
        
        var stringFDate = fYear + "/" + fMonth + "/" + fDay;        
        
        var lYear = JABA.Calendar.daysOfWeek[6].year;
        var lMonth = JABA.Calendar.daysOfWeek[6].month;
        var lDay = JABA.Calendar.daysOfWeek[6].day;
        
        var stringLDate = lYear + "/" + lMonth + "/" + lDay;        
        
        $.get("php/getBookings.php",{fDate:stringFDate, lDate:stringLDate},function(data){                               
            
            // för varje bokning inom datum-ramarna 
            $.each(data, function(i, n){        
                
                // skicka med bId, bName, bDate, bTime, bDesc
                if(JABA.Calendar.startTime <= parseInt(n[3]) && parseInt(n[3]) <= JABA.Calendar.endTime){                
                    var aBooking = new JABA.Booking(n[0], n[1], n[2], n[3], n[4]);    
                } 
            });
            
        }, 'json').done(function(){
            $("div[class='row']").not(".appointed").click(function(){

                JABA.Booking.BookingForm(false,"","",$(this).data("date"),$(this).data("time"));
            });
        });
    },
            
    // WEEK funktion som skapar COLUMNER och RADER i kalendern
    getWeekDivs: function(){
        
        // skapa TIDscolumn och rows         
        var timeDiff = JABA.Calendar.endTime - JABA.Calendar.startTime + 1;
        var colHeight = timeDiff * 60;
        var timeCol = $("<div></div>").addClass("timeCol").height(colHeight).appendTo($("#calendar"));
        $("#calendar").height(colHeight);        
        
        for( var j = 0; j < timeDiff; j++){
            $("<div>"+(j+parseInt(JABA.Calendar.startTime))+":00" +"</div>").addClass("timeRow").appendTo(timeCol);     
        }

        var dataDate = new Date(JABA.Calendar.daysOfWeek[0].year, JABA.Calendar.daysOfWeek[0].month, JABA.Calendar.daysOfWeek[0].day);                
        
        for(var i=0; i < 7; i++){
            var col = $("<div></div>").addClass("column").height(colHeight).appendTo("#calendar");
            
            if(i == JABA.Calendar.todayColNr && $.isNumeric(JABA.Calendar.todayColNr)){
                col.addClass("todayCol"); 
            }
        
            var dateString = JABA.Calendar.daysOfWeek[i].year + "-" + JABA.Calendar.daysOfWeek[i].month + "-" + JABA.Calendar.daysOfWeek[i].day;        
            
            for( var j = 0; j < timeDiff; j++){
                
                var timeString = (j+parseInt(JABA.Calendar.startTime));
                
                if(parseInt(timeString) < 10){
                    timeString = "0" + timeString;
                }
                
                var $rowDiv = $("<div class='row' data-time='"+timeString+"' data-date='"+dateString+"'></div>").appendTo(col);                 
            }        
        }
    },
    
    // sätter färgerna för bokade dagar i månadsvyn
    setMonthColors: function(chosenDate){
        
        var todayDate = new Date();
        
        var number;
        var iterations = JABA.Calendar.iterations;        
        
        var firstDay = JABA.Calendar.firstDay;
        var lastDay = JABA.Calendar.lastDay;
        
        for(var j = 2; j < iterations; j++){
            
            number = j - firstDay;
            
            if(number < 1 || number > lastDay){
                number = "";              
            }                         
            
            if($.isNumeric(number)){    

                if(new Date(chosenDate.getFullYear(), chosenDate.getMonth(), number).setHours(0,0,0,0) == todayDate.setHours(0,0,0,0)){
                    $("a[data-number="+number+"]").parent().addClass('isTodayDay');                    
                }
                
                if(JABA.Calendar.monthBookingsArr[number].bookings.length > 0){
                    $("a[data-number="+number+"]").parent().addClass('isBookedDay');
                    
                } else{                
                    $("a[data-number="+number+"]").parent().addClass('isDayOfMonth');
                    
                }                
            }                                    
        }
    },
    
    // visar inställnings menyn
    settingsForm: function(updateDate){
                
        var $overlay = $("<div id='overlay'></div>").prependTo("body");;
                
        var $modal = $("<div id='modal'></div>").prependTo($overlay); 
        
        $("<h2>Settings</h2>").appendTo($modal);
        
        var $viewValue = $("<div></div>").appendTo($modal);
        var $viewLabel = $("<label>View Mode</label>").appendTo($viewValue);
        var $viewInput = $("<select><option value='Week'>Week</option><option value='Month'>Month</option></select>").val(JABA.Calendar.mode).appendTo($viewValue);        
        
        var $startValue = $("<div></div>").appendTo($modal);
        var $startLabel = $("<label>Start Time</label>").appendTo($startValue);
        var $startInput = $("<input type='number' min='0' max='23' value='"+JABA.Calendar.startTime+"'>").appendTo($startValue);
        
        var $endValue = $("<div></div>").appendTo($modal);
        var $endLabel = $("<label>End Time</label>").appendTo($endValue);
        var $endInput = $("<input type='number' min='0' max='23' value='"+JABA.Calendar.endTime+"'>").appendTo($endValue);
    
        JABA.Calendar.addBtn($modal, "btnSave").click(function(event){
            
            event.preventDefault();
            var sValue = parseInt($startInput.val());
            var eValue = parseInt($endInput.val());
            
            if(($.isNumeric(sValue) && Math.floor(sValue) == sValue) && (0 <= sValue && sValue <= 23)){
                if(($.isNumeric(eValue) && Math.floor(eValue) == eValue) && (0 <= eValue && eValue <= 23)){

                    if((sValue < eValue)){
                        $.post("php/optionsSet.php",{startTime: sValue, endTime: eValue},function(data){        
                            $overlay.remove();                                                                                  
                            JABA.Calendar.getSettings();                                                                                                
                            
                            if($viewInput.val() == "Week"){
                                JABA.Calendar.mode = "Week";                            
                            } else if($viewInput.val() == "Month"){
                                JABA.Calendar.mode = "Month";                            
                            }                            
                            
                            JABA.Calendar.refresh(new Date(updateDate));                                
                            
                        });
                        
                    } else{
                        $endLabel.addClass("invLabel");
                        $endLabel.text("EndTime must be > StartTime"); 
                    }
                } else{
                        $endLabel.addClass("invLabel");
                        $endLabel.text("EndTime must be integer 0 - 23"); 
                }
            } else{
                        $startLabel.addClass("invLabel");
                        $startLabel.text("StartTime must be integer 0 - 23"); 
            }
        });
                
        JABA.Calendar.addBtn($modal, "btnLogOut").click(function(event){
          event.preventDefault();
            $.get("php/loginStop.php",{},function(data){                                
                window.location.replace("login.html");
            });
        });                
        
        JABA.Calendar.addBtn($modal, "btnClose").click(function(event){
            event.preventDefault();
            $overlay.remove();
        });                            
    },
    
    // tar användaren till valfritt datum
    goToDate: function(updateDate){
        
        var $overlay = $("<div id='overlay'></div>").prependTo("body");
        
        var $modal = $("<div id='modal'></div>").prependTo($overlay);
        
        $("<h2>Choose Date</h2>").appendTo($modal);
        
        var $form = $("<form action='' method='post'></form>").appendTo($modal);
        
        var $datePickLabel = $("<label for='datePick'>Date:</label>").appendTo($form);
        var $datePickInput = $("<input type='text' name='datePick' id='datePick' placeholder='yyyy-mm-dd' maxlength='10'/>").appendTo($form);
        
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
        
        $form.submit(function(event){
            
            event.preventDefault();
            
            var toDate = $datePickInput.val();
            
            if($("input.notValid").length == 0){
                if(toDate == ""){
                    toDate = updateDate;
                }                                        
                
                JABA.Calendar.refresh(new Date(toDate));                    
                $overlay.remove();   
            }   
            
            else{
                $datePickLabel.text("Date: use 'yyyy-mm-dd' format");
                $datePickLabel.addClass("invLabel");
            }
        });
                                
        JABA.Calendar.addBtn($modal, "btnWeek").click(function(event){
            event.preventDefault();
            JABA.Calendar.mode = "Week";                
            $form.submit();
        });
    
        JABA.Calendar.addBtn($modal, "btnMonth").click(function(event){
            event.preventDefault();
            JABA.Calendar.mode = "Month";                
            $form.submit();
        });
                
        JABA.Calendar.addBtn($modal, "btnClose").click(function(event){
            event.preventDefault();
            $overlay.remove();
        });
    }, 
    
    // lägger till knapp med click funktion
    addClickBtn: function(whereData, classData, func, funcData, secFunc){
        var $btn = $("<div></div>").appendTo(whereData);
        $("<a href='#'></a>").addClass(classData).click(function(event){
            event.preventDefault();
            func(funcData);
            if(secFunc){
                secFunc();
            }
        }).appendTo($btn);
    },
    
    // lägger till knapp med klass
    addBtn: function(whereData, classData){
        var $btn = $("<div></div>").appendTo(whereData);
        return $("<a href='#'></a>").addClass(classData).appendTo($btn);
    },
    
    // ändrar inställningsläge till månad eller vecka
    setMode: function(choice){
        JABA.Calendar.mode = choice;
    },
    
    // hämtar tidsintsällningar från servern
    getSettings: function(){        
        $.ajax({
            type: "get",
            url: "php/optionsGet.php",
            async: false
        }).done(function(data){
            var dataArr = data.split('-');
            JABA.Calendar.startTime = dataArr[0];
            JABA.Calendar.endTime = dataArr[1];            
        });                    
    },
    
    firstDate : new Date(),
    lastDate : new Date(),
    startTime:0,
    endTime:23,
    isBooked:false,
    todayColNr: "",
    mode: "Month",
    daysOfWeek: [{dayStr: "Monday"}, {dayStr: "Tuesday"}, {dayStr: "Wednesday"}, {dayStr: "Thursday"}, {dayStr: "Friday"}, {dayStr: "Saturday"}, {dayStr: "Sunday"}],
    daysOfMonth: [],
    monthBookingsArr:[],
    lastDay: 1,
    firstday: 1,
    iterations: 37
};

$(document).ready(function(){
    JABA.Calendar.getSettings();
    JABA.Calendar.refresh(new Date());
});















