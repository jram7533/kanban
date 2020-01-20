<?php 
$host         = "localhost";
$username     = "";
$password     = "";
$dbname       = "kanban";

/* Create connection */
$conn = new mysqli($host, $username, $password, $dbname);

/* Check connection  */
if ($conn->connect_error) {
     die("Connection to database failed: " . $conn->connect_error);
}

/* SQL query to get results from database */
$sql = "SELECT id, title, owner, description, assigned, due, priority, status FROM kanban";

$result = $conn->query($sql);

/* If there are results from database push to result array */
$data = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        array_push($data, $row);
    }
}

/* send a JSON encoded array to client */
header('Content-type: application/json');
echo json_encode($data);

$conn->close();

?>
