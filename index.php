<!DOCTYPE html>
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

	<!-- CSS
  ================================================== -->
	<link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/base.css">

    <?php
        include "config.php";

        $query = "SELECT * FROM test";

        $result = mysql_query($query);

        while($temp = mysql_fetch_array($result)){
            echo "<h3>" . $temp['test'] . "</h3>";
        }
    ?>

</head>
    
<body>
    <div id="header">JABA Juhani Aavanens Booking App</div>
    
    <!-- TEST FORMULÄR -->
    <form action="test.php" method="post">
        
        <input id="test" type="text"></input>

        <input type="submit" name="submit" value="submit"></input>
    </form>

    <!-- SLUT TEST FORMULÄR -->
    
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