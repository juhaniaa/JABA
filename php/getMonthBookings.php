<?php
    header('Content-type: text/html; charset=utf-8');
    include "../config.php";
    
    $month = $_GET["month"];

    $myQuery = "SELECT * FROM `aavanenprogramm`.`Bookings` where `Date` = '".$month."'";
    $result = mysql_query($myQuery);

    $data = array();
    while($row = mysql_fetch_row($result)){
        $data[] = $row;
    }
    echo json_encode($data);
    
?>