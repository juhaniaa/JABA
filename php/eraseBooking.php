<?php
    header('Content-type: text/html; charset=utf-8');
    include "../config.php";
    
    $bookingId = $_POST["bookingId"];

    $myQuery = "DELETE FROM `aavanenprogramm`.`Bookings` WHERE `Bookings`.`Booking` = " . $bookingId;
    mysql_query($myQuery);

    header("Location: ../");

?>