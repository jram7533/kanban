<?php 
    $host         = "localhost";
    $username     = "";
    $password     = "";
    $dbname       = "kanban";
    
    $id = $_POST["id"];
    
    /* Create connection */
    $conn = new mysqli($host, $username, $password, $dbname);

    $sql = "DELETE FROM kanban WHERE id = " . $id;
    
    /* Check connection  */
    if ($conn->connect_error) {
         die("Connection to database failed: " . $conn->connect_error);
    }

    mysqli_query($conn, $sql)

    $conn -> close();
?>