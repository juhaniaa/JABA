<?php
    header('Content-type: text/html; charset=utf-8');
    
    include "config.php";

    

    $test = $_POST['test'];

    var_dump($_POST);
    
    /* insert new row into table test */
    mysql_query("INSERT INTO `aavanenprogramm`.`test` (`testID` ,`test`)
    VALUES (NULL , '$test');");

    /* Show all rows in table test */
    $query = "SELECT * FROM test";

    $result = mysql_query($query);

    while($temp = mysql_fetch_array($result)){
        echo "<h3>" . $temp['test'] . "</h3>";
    }
    
?>