<?php
    header('Content-type: text/html; charset=utf-8');
    include "../config.php";
    include "cleanBooking.php";
    
    if(checkSet() != FALSE){
        
        
        if(allClean()){
            
            
            $name = mysql_real_escape_string($_POST["newName"]);   
            $date = mysql_real_escape_string($_POST["newDate"]);
            $time = mysql_real_escape_string($_POST["newTime"]);
            $desc = mysql_real_escape_string($_POST["newDescription"]);
            
            $myQuery = "INSERT INTO Bookings(Name, Date, Time, Description) VALUES('$name', '$date', '$time', '$desc')";
            mysql_query($myQuery);

            echo $date;
            
        }    
    }
?>