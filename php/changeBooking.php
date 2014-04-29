<?php
    header('Content-type: text/html; charset=utf-8');
    include "../config.php";

    $name = $_POST["newName"];   
    $date = $_POST["newDate"];
    $time = $_POST["newTime"];
    $desc = $_POST["newDescription"];
    $bookingId = $_POST["bookingId"];

    
    $myQuery = "UPDATE `aavanenprogramm`.`Bookings` SET `Name` = '".$name."',`Date` = '".$date."',`Time` = '".$time."',`Description` = '".$desc."' WHERE `Bookings`.`Booking` =".$bookingId;
    mysql_query($myQuery);

    header("Location: ../");
    
?>