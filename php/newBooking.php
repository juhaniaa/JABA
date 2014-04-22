<?php
    header('Content-type: text/html; charset=utf-8');
    include "config.php";

    $name = $_POST["newName"];   
    $date = $_POST["newDate"];
    $time = $_POST["newTime"];
    $desc = $_POST["newDescription"];

    
    mysql_query("INSERT INTO Bookings(Name, Date, Time, Description)
                        VALUES('$name', '$date', '$time', '$desc')") or die(mysql_error());

    header("Location: index.html");
    
?>