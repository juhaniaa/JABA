<?php
    header('Content-type: text/html; charset=utf-8');
    
    $startTime = $_POST["startTime"];  
    $endTime = $_POST["endTime"];  

    $File = "options.php";
    $Handle = fopen($File, 'w');
    $Data = $startTime;
    fwrite($Handle, $Data);
    $Datas = "-";
    fwrite($Handle, $Datas);
    $Datae = $endTime;
    fwrite($Handle, $Datae);
    fclose($Handle);
?>