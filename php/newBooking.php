<?php
    header('Content-type: text/html; charset=utf-8');
    include "config.php";

    $newName = "my inserted person";    
    $date = $_REQUEST["newDate"];
    $time = $_POST["newTime"];
    $desc = $_POST["newDescription"];

    foreach($_POST as $key => $value){
        echo "Field ".htmlspecialchars($key)." is ".htmlspecialchars($value)."<br>";

    }

    
    mysql_query("INSERT INTO Bookings(Name, Date, Time, Description)
                        VALUES('$newName', '$newDate', '$newTime', '$newDescription')") or die(mysql_error());
    
?>