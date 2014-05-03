<?php
    header('Content-type: text/html; charset=utf-8');
    include "../config.php";

    // check that user and pass are ok!
    if(logVarsOk()){

        session_start();
    
        $usr = $_POST["user"];   
        $pas = $_POST["pass"];
    
        $myQuery = "SELECT * FROM `aavanenprogramm`.`Users` WHERE `UserName` = '".$usr."'";
        $result = mysql_query($myQuery);
        $row = mysql_fetch_row($result);
        
        if($row[2] == md5($pas)){
            $_SESSION['username'] = $usr;
            header("Location: ../");               
        } else{
            header("Location:../login.html?error=1");
        }
    } else{
            header("Location:../login.html?error=2");
    }


    function logVarsOk(){
        
        if(!checkLogSet()){
            return false;
        }
        
        if(cleanTest($_POST["user"], "string", 30)){
        } else {return false;}
        
        if(cleanTest($_POST["pass"], "string", 40)){        
        } else {return false;}
        
        return true;
    }

    function checkLogSet(){
        return isset($_POST["user"], $_POST["pass"]);
    }


    function cleanTest($string, $type, $length){

        $type = 'is_'.$type;
        
        if(!$type($string)){
            return FALSE;
        }
        
        elseif(empty($string)){
            return FALSE;
        }
        
        elseif(strlen($string) > $length){
            return FALSE;
        }
        
        else{
            return TRUE;
        }
        
    }

?>