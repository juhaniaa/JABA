"use strict";
var JABA = JABA || {};

JABA.Booking = function(bId, bName, bDate, bTime, bDesc){
    
    /* Lägg till bokningen som en a-tag på rätt plats i kalendern */
    var bRow = bTime - JABA.Calendar.startTime;
    var bCol = new Date(bDate).getDay() - 1; 
    var bSquare = $("#calendar .column:eq(" + bCol + ") .row").eq(bRow).addClass("appointed");    
        
    $("<a href='#'>BookNr: " + bId + "<br/>Name: " + bName + "<br/>Desc: " + bDesc + "</a>").click(function(event){  
        event.preventDefault();
        JABA.Booking.BookingForm(true, bId, bName, bDate, bTime, bDesc);
    }).appendTo(bSquare);
};

// skapar ett formulär för att skapa eller ändra en bokning
JABA.Booking.BookingForm = function(ifOld, bId, bName, bDate, bTime, bDesc){
    
    var ifMonth;
    
    if(JABA.Calendar.mode == "Month"){
        ifMonth == true;
    } else if(JABA.Calendar.mode == "Week"){
        ifMonth == false;
    }
    
    function createFormPiece(name, bValue, bLength, bPattern, bHolder, bMessage){
        
        var $pieceDiv = $("<div></div>").appendTo($bForm);
        
        var $label = $("<label id='label" + name + "' for='new" + name + "'>" + name + "</label>").appendTo($pieceDiv);
        var $input = $("<input type='text' name='new" + name + "' id='new" + name + "' value='" + bValue +"' maxlength='" + bLength + "' placeholder='" + bHolder + "'/>").appendTo($pieceDiv);
        
        /* CHANGE */
        $input.change(function(){
            
            /* inmatad info måste matcha med regex
            inmatad tid måste passa in i aktuella tidsinställningarna
            och inmatad tid får inte redan vara bokad */                                            
            if($(this).val().match(bPattern) && checkTimeBoundaries($(this).val())){
                
                // OK att skicka
                $(this).removeClass("notValid");
                $label.text(name);
                $label.removeClass("invLabel");            
                
                /* Om man ändrar datum eller tid */
                if(($input.is("input[id=newDate]") || $input.is("input[id=newTime]")) && (!$("input[id=newDate]").hasClass("notValid") && !$("input[id=newTime]").hasClass("notValid"))){
                    
                    /* Se om tiden redan bokad */ 
                    // kontrollera endast om bokad ifall både tid och datum är godkänt format
                    JABA.Booking.AlreadyBooked($("input[id=newDate]").val(),$("input[id=newTime]").val(), bDate, bTime, ifMonth, bId);
                    if(!JABA.Calendar.isBooked){                    
                        // giltig förklara
                        $("label[id=labelDate]").text("Date");
                        $("label[id=labelDate]").removeClass("invLabel");
                        $("label[id=labelTime]").text("Time");
                        $("label[id=labelTime]").removeClass("invLabel");
                    } else{
                        // ogiltig förklara
                        $("label[id=labelDate]").text("Date already booked");
                        $("label[id=labelDate]").addClass("invLabel");
                        $("label[id=labelTime]").text("Time already booked");
                        $("label[id=labelTime]").addClass("invLabel");
                    }
                }
            } else {
                // EJ går att skicka
                $(this).addClass("notValid");
                $label.text(name + ":" + bMessage);
                $label.addClass("invLabel");
            }           
            
        });
        
        function checkTimeBoundaries(timeValue){
            
            /* Då tiden ändras */
            if($input.is("input[id=newTime]")){
                if(parseInt(JABA.Calendar.startTime) <= timeValue && timeValue <= parseInt(JABA.Calendar.endTime)){                                        
                    return true;
                } else {return false;}
            } else {
                
                return true;
            }
        }                        
    }
    
    function flagEmptyFields(){
        $("input:text").each(function(){

            if($(this).val() == ""){
                $(this).addClass("notValid");
            }
        });            
    }    
    
    var $overlay = $("<div id='overlay'></div>").prependTo("body");    
    var $modal = $("<div id='modal'></div>").prependTo($overlay);
    
    var postInfo = "php/newBooking.php";
    var headerInfo = "New Booking";
    
    if(ifOld){        
        postInfo = "php/changeBooking.php";        
        headerInfo = "Change Booking";
    }                  
    
    $("<h2>" + headerInfo + "</h2>").appendTo($modal);

    var $bForm = $("<form action='" + postInfo + "' id='changeForm' method='post'></form>");
    
    /* SUBMIT */
    $bForm.submit(function(event){            
        
        flagEmptyFields()           
        
        /* Om det inte finns några felaktiga fält */
        if($("input.notValid").length == 0){
            
            /* Och tiden inte redan är bokad */
            if(!JABA.Calendar.isBooked){                                    
                var $form = $(this);
                $.ajax({
                    type: $form.attr('method'),
                    url: $form.attr('action'),
                    data: $form.serialize()
                }).done(function(data){
                    
                    if(Date.parse(data)){                                               

                        JABA.Calendar.refresh(new Date(data));                                
                                                
                        new JABA.Message("Booking has been saved", "okMessage");
                        
                    }else{                        
                        new JABA.Message("Something went wrong", "badMessage");
                    }
                                       
                    $overlay.remove();
                });   
            }
        }          
        
        event.preventDefault();
    }).appendTo($modal);                     
         
    /* om ändring av bokning så visas bokningsnr */
    if(ifOld){        
        var $idLabel = $("<label for='bookingId'>Booking Nr:</label>").appendTo($bForm);
        var $idInput = $("<input type='text' id='bookingId' name='bookingId' value='" + bId + "' readonly='readonly'/>").appendTo($bForm);
    }
    
    /* om datum och tid inte är definierade */
    if(!ifOld){
        if(typeof bDate === "undefined"){
            bDate = "";                
        }
        
        if(typeof bTime === "undefined"){
            bTime = "";               
        }                    
        bName = "";
        bDesc = "";
    }
    
    createFormPiece("Name", bName, 20, /^[\w åäöÅÄÖ]{3,20}$/, "Name", " 3-20 characters");
    createFormPiece("Date", bDate, 10, /^(19|2[0-9])[0-9][0-9]-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])$/, "yyyy-mm-dd", " 'yyyy-mm-dd' format");
    createFormPiece("Time", bTime, 2, /^([0-9]|[01][0-9]|2[0-3])$/, "Time", " " + JABA.Calendar.startTime + "-" + JABA.Calendar.endTime);
    createFormPiece("Description", bDesc, 30, /^[\w åäöÅÄÖ]{3,30}$/, "Description", " 3-20 characters");
    
    /* save BUTTON */
    JABA.Calendar.addBtn($modal, "btnSave").click(function(event){
        event.preventDefault();
        $bForm.submit();
    });
    
    
    /* erase BUTTON */
    if(ifOld){ 
        JABA.Calendar.addBtn($modal, "btnErase").click(function(event){            
            event.preventDefault();
            $overlay.remove();
            
            $.post("php/eraseBooking.php",{bookingId:bId},function(data){  
                
                JABA.Calendar.refresh(new Date(bDate));
                
                /*if(ifMonth){                    
                    JABA.Month.refreshMonth(new Date(bDate));
                } else{                    
                    JABA.Calendar.refresh(new Date(bDate));
                }*/
            });            
            new JABA.Message("Booking has been erased", "okMessage");
        });                
    }
    
    
    /* close BUTTON */
    JABA.Calendar.addBtn($modal, "btnClose").click(function(event){
        event.preventDefault();
        $overlay.remove();
    });        
};

// ger en lista på kommande bokningar
JABA.Booking.BookingList = function(){
                
        var $overlay = $("<div id='overlay'></div>").prependTo("body");;
                
        // listan läggs till i $modal
        var $modal = $("<div id='bookingList'></div>").prependTo($overlay);   

        var fromDate = new Date();
    
        var dateString = fromDate.getFullYear() + "/" + (fromDate.getMonth() + 1) + "/" + fromDate.getDate();        
    
        $.get("php/getList.php",{fDate:dateString},function(data){                       
            
            $("<h2>Upcoming Bookings</h2>").appendTo($modal);
            
            var weekDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            
            // för varje bokning inom datum-ramarna 
            $.each(data, function(i, n){
                
                // skapa p-tag som skriver ut dag + datum
                // endast om exact det datumet inte redan varit
                var testDate = new Date(n[2]);
                
                if($("p[id='"+n[2]+"']").length == 0){
                    console.log(weekDay[testDate.getDay()]);
                    $("<p id="+n[2]+">"+weekDay[testDate.getDay()]+" "+ n[2] +"</p>").appendTo($modal);
                }                
                               
                //  bId, bName, bDate, bTime, bDesc   n[0], n[1], n[2], n[3], n[4]);  
                var $listDiv = $("<div class='listDiv'></div>").addClass("appointed").appendTo($modal);
                $("<a href='#'>Time: " + n[3] + "</br>Name: " + n[1] + "</br>Desc: " + n[4] + "</a>").click(function(event){
                    event.preventDefault();
                    $overlay.remove();
                    JABA.Calendar.refresh(new Date(n[2]));
                    JABA.Booking.BookingForm(true, n[0], n[1], n[2], n[3], n[4]);
                }).appendTo($listDiv);
                                
            });
            
            JABA.Calendar.addBtn($modal, "btnClose").click(function(event){
                event.preventDefault();
                $overlay.remove();
            });
                         
            
        }, 'json');                                        
};

// kontrollerar om en bokningstid + datum redan är upptagen
JABA.Booking.AlreadyBooked = function(bDate, bTime, preDate, preTime, isMonth, bId){
    
    var result;
    if(bTime == preTime && bDate == preDate){       
        JABA.Calendar.isBooked = false;
    } else{    
        $.ajax({
            type: "get",
            url: "php/isBooked.php",
            async: false,
            data: {btime:bTime, bdate:bDate}
        }).done(function(data){
            if(data == "false"){
                result = false;
            } else {
                result = true;
            }        
            
            JABA.Calendar.isBooked = result;       
        });  
    }                                    
};