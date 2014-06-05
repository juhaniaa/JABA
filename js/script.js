"use strict";
var JABA = JABA || {};


JABA.Calendar = {
    refresh: function(updateDate){
        
        console.log(updateDate);
        $("#menu, #dates, #calendar").empty();
                            
        /* Hämtar veckans datum */
        JABA.Calendar.getWeekDates(updateDate);
        
        /* Hämtar månads datum 
        JABA.Calendar.getMonthDates(updateDate);*/
                                
        /* Lägger till menyn */
        JABA.Calendar.addMenu(updateDate);        
        
        /* Lägger till COLUMNER och RADER i kalendern  */
        JABA.Calendar.getCalDivs();
        
        /* Lägger till bokningarna i kalendern */
        JABA.Calendar.getAjaxBookings(updateDate);

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
    
    getMonthDates: function(chosenDate){
        for(var k = 0; k < 32; k++){
            
            JABA.Calendar.daysOfMonth.push({
                bookings: [],
            });            
        }  
    },
    
    // lägger till veckans dagar och datum i rubrik-menyn
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
    
    // lägger till ruta med aktuella datum
    addMenuDates: function(updateDate){
        
        var month = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        var menuClass;
        var datesStr;
        JABA.Calendar.mode = "Week";
        if(JABA.Calendar.mode == "Week"){
            
            var fDay = JABA.Calendar.daysOfWeek[0].day;        
            var fMonth = month[parseInt(JABA.Calendar.daysOfWeek[0].month)];
            var fYear = JABA.Calendar.daysOfWeek[0].year;
            
            var tDay = JABA.Calendar.daysOfWeek[6].day;
            var tMonth = month[parseInt(JABA.Calendar.daysOfWeek[6].month)];
            var tYear = JABA.Calendar.daysOfWeek[6].year;
            
            
            menuClass = "toFromDates";
            datesStr = fDay + " " + fMonth + " " + fYear + " -</br>" + tDay + " " + tMonth + " " + tYear;
            
        } else if(JABA.Calendar.mode == "Month"){
            menuClass = "monthDates";
        }
        
        var menuDates = $("<div></div>").addClass(menuClass).appendTo("#menu");
        
        $("<a href='#'>" + datesStr + "</a>").click(function(event){
            event.preventDefault();
            JABA.Calendar.goToDate(updateDate);
        }).appendTo(menuDates);
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
        
        var tempMode = "";
            
            $form.submit(function(event){
                
                event.preventDefault();
                
                var toDate = $datePickInput.val();
                
                if($("input.notValid").length == 0){
                    if(toDate == ""){
                        toDate = updateDate;
                    }                                        
                    
                    if(tempMode == "Week"){
                        JABA.Calendar.refresh(new Date(toDate));
                        
                    } else if(tempMode == "Month"){
                        JABA.Month.refreshMonth(new Date(toDate));
                    }
                    $overlay.remove();   
                }                
            });
                                    
            JABA.Calendar.addBtn($modal, "btnWeek").click(function(event){
                event.preventDefault();
                JABA.Calendar.mode = "Week";
                tempMode = "Week";
                $form.submit();
            });
        
            JABA.Calendar.addBtn($modal, "btnMonth").click(function(event){
                event.preventDefault();
                JABA.Calendar.mode = "Month";
                tempMode = "Month";
                $form.submit();
            });
                    
            JABA.Calendar.addBtn($modal, "btnClose").click(function(event){
                event.preventDefault();
                $overlay.remove();
            });
    },        
    
    setMode: function(choice){
        JABA.Calendar.mode = choice;
    },
    
    // lägger till menyn
    addMenu: function(updateDate){
                     
        // Lista med bokningar
        JABA.Calendar.addClickBtn("#menu", "list", JABA.Booking.BookingList, "");                
        
        // Ny bokning
        JABA.Calendar.addClickBtn("#menu", "new", JABA.Booking.BookingForm, false);                
        
        // Tidigare vecka
        JABA.Calendar.addClickBtn("#menu", "prev", JABA.Calendar.refresh, new Date(updateDate.getFullYear(), updateDate.getMonth(), updateDate.getDate() - 7));
        
        // Från till datum
        JABA.Calendar.addMenuDates(updateDate);                
        
        // Nästa vecka
        JABA.Calendar.addClickBtn("#menu", "next", JABA.Calendar.refresh, new Date(updateDate.getFullYear(), updateDate.getMonth(), updateDate.getDate() + 7));                
        
        // Till idag
        JABA.Calendar.addClickBtn("#menu", "today", JABA.Calendar.refresh, new Date());
                
        // Inställningar
        JABA.Calendar.addClickBtn("#menu", "btnSetting", JABA.Calendar.settingsForm, updateDate);
        
        // måndag - söndag datum
        JABA.Calendar.addHeaderDates();
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
    
    // lägger till bokningar i veckovyn
    getAjaxBookings: function(chosenDate){
        
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
            
    // funktion som skapar COLUMNER och RADER i kalendern
    getCalDivs: function(){
        
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
                                JABA.Calendar.refresh(new Date(updateDate));
                                JABA.Calendar.mode = "Week";
                            } else if($viewInput.val() == "Month"){
                                JABA.Month.refreshMonth(new Date(updateDate));
                                JABA.Calendar.mode = "Month";
                            }
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
    daysOfMonth: []
};

$(document).ready(function(){
    JABA.Calendar.getSettings();
    JABA.Month.refreshMonth(new Date());
});















