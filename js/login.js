"use strict";
var JABA = JABA || {};

JABA.Login = {
    LoginForm: function(){
        var $loginContainer = $("#loginContainer");
        $("<h2>Log In</h2>").appendTo($loginContainer);
        var $loginForm = $("<form id='login' action='php/login.php' method='post' accept-charset='UTF-8'></form>").appendTo($loginContainer);
        var $loginFieldset = $("<fieldset></fieldset>").appendTo($loginForm);
        
        var $loginLegend = $("<legend></legend>").appendTo($loginFieldset);
        
        var $loginUsrLbl = $("<label for='user'>User Name:</label>").appendTo($loginFieldset);
        var $loginUsrInp = $("<input type='text' name='user' id='user' maxlength='50'/>").appendTo($loginFieldset);
        var $loginPasLbl = $("<label for='pass'>Password:</label>").appendTo($loginFieldset);
        var $loginPasInp = $("<input type='password' name='pass' id='pass' maxlength='50'/>").appendTo($loginFieldset);
        
        var $loginButton = $("<a href='#'></a>").addClass("btnLogIn").click(function(event){
            event.preventDefault();
            $loginForm.submit();
        }).appendTo($loginFieldset);
    }
};

$(document).ready(function(){
    JABA.Login.LoginForm();
});
