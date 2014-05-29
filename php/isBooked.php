<?php
    header('Content-type: text/html; charset=utf-8');
    include "../config.php";
    
    $date = $_GET["bdate"];
    $time = $_GET["btime"];

    $myQuery = "SELECT * FROM `aavanenprogramm`.`Bookings` where `Date` = '".$date."' and `Time` = '".$time."'";
    $result = mysql_query($myQuery);

    
    $row = mysql_fetch_row($result);
    echo json_encode($row);

    
?>