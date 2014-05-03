<?PHP 
    include "php/loginFunc.php";
    $logged = CheckLogin();
    if(!$logged){
        header("Location:../login.html");    
    } else{
        
    }
?>
<html lang="en">
<head>

	<!-- Basic Page Needs
  ================================================== -->
	<meta charset="utf-8">
	<title>JABA - Home</title>
	<meta name="description" content="">
	<meta name="author" content="">

    <script src="js/jquery-2.1.0.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/script.js" type="text/javascript" charset="utf-8"></script>
    <script src="js/Booking.js" type="text/javascript" charset="utf-8"></script>

	<!-- CSS
  ================================================== -->
	<link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/base.css">

</head>
    
<body>
    <div id="header">JABA Juhani Aavanens Booking App</div>
    <div id="logOut">Log Out</div>
    
	<div id="app">
        
        <!-- Menu with buttons to navigate dates -->
        <div id="menu"></div>
        
        <!-- Bar for presenting dates -->
        <div id="dates"></div>
        
        <!-- table for presenting data -->
		<div id="calendar"></div>

	</div>
</body>
</html>