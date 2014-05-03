<?php
    header('Content-type: text/html; charset=utf-8');
    include "../config.php";
    include "cleanBooking.php";

    if(checkSet() != FALSE){
        
        
        if(allClean()){
            
            $name = $_POST["newName"];   
            $date = mysql_real_escape_string($_POST["newDate"]);
            $time = mysql_real_escape_string($_POST["newTime"]);
            $desc = mysql_real_escape_string($_POST["newDescription"]);
            $bookingId = mysql_real_escape_string($_POST["bookingId"]);

    
            $myQuery = "UPDATE `aavanenprogramm`.`Bookings` SET `Name` = '".$name."',`Date` = '".$date."',`Time` ='".$time."',`Description` = '".$desc."' WHERE `Bookings`.`Booking` =".$bookingId;
            mysql_query($myQuery);

            echo $date;
            
        }
    }
    
?>