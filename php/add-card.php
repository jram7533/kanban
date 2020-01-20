<?php 
    $host         = "localhost";
    $username     = "";
    $password     = "";
    $dbname       = "kanban";
    
    $job = $_POST["title"];
    $owner = $_POST["owner"];
    $desc = $_POST["description"];
    $assign = $_POST["assigned"];
    $due = $_POST["due"];
    $priority = $_POST["priority"];
    
    /* Create connection */
    $conn = new mysqli($host, $username, $password, $dbname);

    $sql = "INSERT INTO kanban (title, owner, description, assigned, due, priority) VALUES ('" . $job . "', '" . $owner . "', '" . $desc . "', '" . $assign . "', '" . $due . "', '" . $priority . "');";
    
    /* Check connection  */
    if ($conn->connect_error) {
         die("Connection to database failed: " . $conn->connect_error);
    }

    if (mysqli_query($conn, $sql) === TRUE) {
//        echo "New record created successfully";
    } else {
//        echo "Error: " . $data . "<br>" . $mysqli_error();
    }

    $conn -> close();
?>