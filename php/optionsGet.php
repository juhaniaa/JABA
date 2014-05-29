<?php
    header('Content-type: text/html; charset=utf-8');

    $file = file_get_contents("options.php");
    echo $file;
?>