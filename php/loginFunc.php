<?php
    header('Content-type: text/html; charset=utf-8');

    function CheckLogin()
    {
         session_start();
          
         if(empty($_SESSION['username']))
         {
            return false;
         } else{
            return true;
         }
    }


?>