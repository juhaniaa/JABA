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
        
        JABA.Calendar.getWeekDates(updateDate);
                                
        JABA.Calendar.addMenu(updateDate);
        
        
        /* lägger till COLUMNER och RADER i kalendern  */
        JABA.Calendar.getCalDivs();
        
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
    
    // lägger till veckans dagar och datum i rubrik-menyn
    addHeaderDates: function(){
        
        $("<div>Time</div>").addClass("timeDate").appendTo($("#dates"));        
        
        var today = new Date();
        
        JABA.Calendar.todayColNr = "";
        
        for( var i = 0; i < 7; i++){
            
            var day = JABA.Calendar.daysOfWeek[i];
            
            var $dateText = $("<div>" + day.dayS + " " + day.day + "</div>").addClass("seventhWidth").appendTo($("#dates"));
                        
            if(day.year == today.getFullYear() && day.month == today.getMonth() + 1 && parseInt(day.day) == today.getDate()){                

                $dateText.addClass("todayMarking");  
                
                JABA.Calendar.todayColNr = i;
            }  
        }
    },
    
    // lägger till ruta med aktuella datum
    addMenuDates: function(updateDate){
        
        var month = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        var menuDates = $("<div class='toFromDates'></div>").appendTo("#menu");
        
        var fDay = JABA.Calendar.daysOfWeek[0].day;        
        var fMonth = month[parseInt(JABA.Calendar.daysOfWeek[0].month)];
        var fYear = JABA.Calendar.daysOfWeek[0].year;
        
        var tDay = JABA.Calendar.daysOfWeek[6].day;
        var tMonth = month[parseInt(JABA.Calendar.daysOfWeek[6].month)];
        var tYear = JABA.Calendar.daysOfWeek[6].year;
        
        $("<a href='#'>" + fDay + " " + fMonth + " " + fYear + " -</br>" + tDay + " " + tMonth + " " + tYear + "</a>").click(function(event){
            event.preventDefault();
            JABA.Calendar.goToDate(updateDate);
        }).appendTo(menuDates);
    },
    
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
                
                else{
                    $datePickLabel.text("Date: use 'yyyy-mm-dd' format");
                    $datePickLabel.addClass("invLabel");
                }
            });
            
            var $weekButton = $("<div></div>").appendTo($modal)
            $("<a href='#'></a>").addClass("btnWeek").click(function(event){                
                event.preventDefault();
                tempMode = "Week";
                //JABA.Calendar.mode = "Week";
                $form.submit();                    
            }).appendTo($weekButton);
            
            var $monthButton = $("<div></div>").appendTo($modal)
            $("<a href='#'></a>").addClass("btnMonth").click(function(event){                
                event.preventDefault();  
                tempMode = "Month";
                //JABA.Calendar.mode = "Month";
                $form.submit();                    
            }).appendTo($monthButton);
            
            var $cancelButton = $("<div></div>").appendTo($modal);
            $("<a href='#'></a>").addClass("btnClose").click(function(event){
                event.preventDefault();
                $overlay.remove();
            }).appendTo($cancelButton);
    },
    
    addMenu: function(updateDate){
                     
        // Lista med bokningar
        JABA.Calendar.addBtn("#menu", "list", JABA.Booking.BookingList, "");                
        
        // Ny bokning
        JABA.Calendar.addBtn("#menu", "new", JABA.Booking.BookingForm, false);                
        
        // Tidigare vecka
        JABA.Calendar.addBtn("#menu", "prev", JABA.Calendar.refresh, new Date(updateDate.getFullYear(), updateDate.getMonth(), updateDate.getDate() - 7));
        
        // Från till datum
        JABA.Calendar.addMenuDates(updateDate);                
        
        // Nästa vecka
        JABA.Calendar.addBtn("#menu", "next", JABA.Calendar.refresh, new Date(updateDate.getFullYear(), updateDate.getMonth(), updateDate.getDate() + 7));                
        
        // Till idag
        JABA.Calendar.addBtn("#menu", "today", JABA.Calendar.refresh, new Date());
                
        // Inställningar
        JABA.Calendar.addBtn("#menu", "btnSetting", JABA.Calendar.settingsForm, updateDate);
        
        // måndag - söndag datum
        JABA.Calendar.addHeaderDates();
    },
    
    addBtn: function(whereData, classData, func, funcData){
        var $btn = $("<div></div>").appendTo(whereData);
        $("<a href='#'></a>").addClass(classData).click(function(event){
            event.preventDefault();
            func(funcData);
        }).appendTo($btn);
    },
    
    getAjaxBookings: function(chosenDate){
            
        var stringFDate = JABA.Calendar.firstDate.getFullYear() + "/" + (JABA.Calendar.firstDate.getMonth() + 1) + "/" + JABA.Calendar.firstDate.getDate();
     
        var stringLDate = JABA.Calendar.lastDate.getFullYear() + "/" + (JABA.Calendar.lastDate.getMonth() + 1) + "/" + JABA.Calendar.lastDate.getDate();

        
        $.get("php/getBookings.php",{fDate:stringFDate, lDate:stringLDate},function(data){                       
        
            
            // för varje bokning inom datum-ramarna 
            $.each(data, function(i, n){        
                
                // skicka med bId, bName, bDate, bTime, bDesc
                if(JABA.Calendar.startTime <= parseInt(n[3]) && parseInt(n[3]) <= JABA.Calendar.endTime){                
                    var aBooking = new JABA.Booking(n[0], n[1], n[2], n[3], n[4]);    
                } else{
                    
                }
            });
            
        }, 'json').done(function(){
            $("div[class='row']").not(".appointed").click(function(){

                JABA.Booking.BookingForm(false,"","",$(this).data("date"),$(this).data("time"));
            });
        });
    },
    
    /* funktion som skapar menyer och gör möjligt att fritt välja datum */
    getDates: function(chosenDate){
        
        // datum vi ändrar till
        var date = new Date(chosenDate);
        
        // arrayer med veckodagar och månader på engelska
        var weekDay = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];                    
        
        $("<div class='timeDate'>Time</div>").appendTo($("#dates"));
        
        JABA.Calendar.todayColNr = "";        
        
        var dateNr = "";
        
        var monDate = JABA.Calendar.firstDate;
        
        for( var i = 0; i < 7; i++){
    
            if(i == 0){
                                
                dateNr = monDate.getDate();
            }
            
            else{
                                
                dateNr = dateNr + 1;
                
                monDate = new Date(monDate.getFullYear(), monDate.getMonth(), dateNr);
                
                dateNr = monDate.getDate();
                
            }            

            // skriver ut tex Wednesday 25            
            var $dayText = $("<div>"+ weekDay[i]  + " " +  dateNr +"</div>").addClass("seventhWidth").appendTo($("#dates"));                        
            
            var today = new Date();
            
            // dagmarkering
            if(monDate.getFullYear() == today.getFullYear() && monDate.getMonth() == today.getMonth() && monDate.getDate() == today.getDate()){                

                $dayText.addClass("todayMarking");  
                
                JABA.Calendar.todayColNr = i;
            }            
        }
        
        var monDate = JABA.Calendar.firstDate;
        var sunDate = JABA.Calendar.lastDate;
        
        // skapa div med class button innehållande från - till datum och lägg till i #menu
        var tempDates = $("<div class='toFromDates'></div>");
        
        $("<a href='#'>"+monDate.getDate() + " " + month[monDate.getMonth()] + " " + monDate.getFullYear() + " -</br>" + sunDate.getDate() + " " + month[sunDate.getMonth()] + " " + sunDate.getFullYear()+"</a>").click(function(event){
            
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
    getCalDivs: function(){
        
        /* skapa TIDscolumn och rows */
        
        var timeDiff = JABA.Calendar.endTime - JABA.Calendar.startTime + 1;
        var colHeight = timeDiff * 60;
        var tempTimeCol = $("<div class='timeCol'></div>").height(colHeight).appendTo($("#calendar"));
        $("#calendar").height(colHeight);        
        
        for( var j = 0; j < timeDiff; j++){
            $("<div class='timeRow'>"+(j+parseInt(JABA.Calendar.startTime))+":00" +"</div>").appendTo(tempTimeCol);     
        }
                    
        var tempCol;     
        
        var dataDate = new Date(JABA.Calendar.firstDate.getFullYear(), JABA.Calendar.firstDate.getMonth(), JABA.Calendar.firstDate.getDate());        
        
        for( var i = 0; i < 7; i++){
            
            var colClass = "column";
            
            tempCol = $("<div></div>").addClass(colClass).height(colHeight);            
            
            if(i == JABA.Calendar.todayColNr && $.isNumeric(JABA.Calendar.todayColNr)){
                tempCol.addClass("todayCol");   
            }                        
            
            // först hämta ut dagen och lägg till 1 om behövs
            var day;
            
            if(i != 0){
                day = dataDate.getDate() + 1;
            } else {
                day = dataDate.getDate();
            }                        
            
            // sedan lägg till i datumobjekt
            dataDate = new Date(dataDate.getFullYear(), dataDate.getMonth(), day);
            
            // till sist hämta ut månad och dag
            var month = dataDate.getMonth() + 1;
            if(month < 10){
                month = "0" + month;            
            }
            
            day = dataDate.getDate();                        
            
            if(day < 10){
                day = "0" + day;
            }
                                    
            var dateString = JABA.Calendar.firstDate.getFullYear() + "-" + month + "-" + day;
            
            for( var j = 0; j < timeDiff; j++){
                
                var timeString = (j+parseInt(JABA.Calendar.startTime));
                if(parseInt(timeString) < 10){
                    timeString = "0" + timeString;
                }
                var $rowDiv = $("<div class='row' data-time='"+timeString+"' data-date='"+dateString+"'></div>").appendTo(tempCol);  
                if(j == timeDiff - 1){
                    $rowDiv.addClass("lastRow");
                }
            }
    
            $("#calendar").append(tempCol);
        }
    },
    
    settingsForm: function(updateDate){
        
        // skapa en div som ligger ovanpå allt
        var $newBack = $("<div id='newBack'></div>").prependTo("body");;
                
        // listan läggs till i $newB
        var $newB = $("<div id='newB'></div>").prependTo($newBack); 
        $("<h2>Settings</h2>").appendTo($newB);
        
        var $viewSetting = $("<div></div>").appendTo($newB);
        var $settingLabel = $("<label>View Mode</label>").appendTo($viewSetting);
        var $settingInput = $("<select><option value='Week'>Week</option><option value='Month'>Month</option></select>").appendTo($viewSetting);
        $settingInput.val(JABA.Calendar.mode);

        
        var $startValue = $("<div></div>").appendTo($newB);
        var $startLabel = $("<label>Start Time</label>").appendTo($startValue);
        var $startInput = $("<input type='number' min='0' max='23' value='"+JABA.Calendar.startTime+"'>").appendTo($startValue);
        
        var $endValue = $("<div></div>").appendTo($newB);
        var $slutLabel = $("<label>End Time</label>").appendTo($endValue);
        var $endInput = $("<input type='number' min='0' max='23' value='"+JABA.Calendar.endTime+"'>").appendTo($endValue);
    
        var $settingsDiv = $("<div></div>").appendTo($newB);
        $("<a href='#'></a>").addClass("btnSave").click(function(event){
            event.preventDefault();
            var sValue = parseInt($startInput.val());
            var eValue = parseInt($endInput.val());
            
            if(($.isNumeric(sValue) && Math.floor(sValue) == sValue) && (0 <= sValue && sValue <= 23)){
                if(($.isNumeric(eValue) && Math.floor(eValue) == eValue) && (0 <= eValue && eValue <= 23)){

                    if((sValue < eValue)){
                        $.post("php/optionsSet.php",{startTime: sValue, endTime: eValue},function(data){        
                            $newBack.remove();                                                                                  
                            JABA.Calendar.getSettings();                                                                                                
                            
                            if($settingInput.val() == "Week"){
                                JABA.Calendar.refresh(new Date(updateDate));
                                JABA.Calendar.mode = "Week";
                            } else if($settingInput.val() == "Month"){
                                JABA.Month.refreshMonth(new Date(updateDate));
                                JABA.Calendar.mode = "Month";
                            }
                        });
                        
                    } else{
                        $slutLabel.addClass("invLabel");
                        $slutLabel.text("EndTime must be > StartTime"); 
                    }
                } else{
                        $slutLabel.addClass("invLabel");
                        $slutLabel.text("EndTime must be integer 0 - 23"); 
                }
            } else{
                        $startLabel.addClass("invLabel");
                        $startLabel.text("StartTime must be integer 0 - 23"); 
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
    startTime:4,
    endTime:17,
    isBooked:false,
    todayColNr: "",
    mode: "Month",
    daysOfWeek: [{dayS: "Monday"}, {dayS: "Tuesday"}, {dayS: "Wednesday"}, {dayS: "Thursday"}, {dayS: "Friday"}, {dayS: "Saturday"}, {dayS: "Sunday"}]
};

$(document).ready(function(){
    JABA.Calendar.getSettings();
    JABA.Month.refreshMonth(new Date());
});















