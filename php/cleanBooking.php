<?php
    header('Content-type: text/html; charset=utf-8');

    function allClean(){
        
        $validChar = array(' ', '-', 'å', 'ä', 'ö');
        
        if(!cleanTest($_POST["newName"], "string", 20) || !ctype_alnum(str_replace($validChar, '', $_POST["newName"])) || isEmpty($_POST["newName"])){
            return false;
        }
        
        if(cleanTest($_POST["newDate"], "string", 10) || !isEmpty($_POST["newDate"])){
            $testDate = $_POST["newDate"];
            $testDateArr = explode("-", $testDate);
            
            foreach($testDateArr as $tryValue){
                if(!is_numeric($tryValue)){return false;}
            }
            
            if(count($testDateArr) == 3 && checkdate($testDateArr[1], $testDateArr[2], $testDateArr[0])){                
                // date ok
            } else {return false;}
        } else {return false;}
        
        
        if(!cleanTest($_POST["newTime"], "numeric", 2) || !ctype_alnum($_POST["newTime"])){
            return false;            
        }
        
        
        if(!cleanTest($_POST["newDescription"], "string", 30) || !ctype_alnum(str_replace($validChar, '', $_POST["newDescription"])) || isEmpty($_POST["newDescription"])){
            return false;
        }
        
        return true;
    }

    function checkSet(){
        return isset($_POST["newName"], $_POST["newDate"], $_POST["newTime"], $_POST["newDescription"]);
    }

    function isEmpty($string){
        if(empty($string)){
            return true;
        } else{
            return false;
        }
    }


    function cleanTest($string, $type, $length){

        $type = 'is_'.$type;
        
        if(!$type($string)){
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