<?php
    header('Content-type: text/html; charset=utf-8');
    include "../config.php";
    
    $fDate = $_GET["fDate"];

    $myQuery = "SELECT * FROM `aavanenprogramm`.`Bookings` where `Date` > '".$fDate."' ORDER BY `Date`, `Time` LIMIT 10";
    $result = mysql_query($myQuery);

    $data = array();
    while($row = mysql_fetch_row($result)){
        $data[] = $row;
    }
    echo json_encode($data);
    
?>