<?php

$host = "sql303.infinityfree.com";
$user = "if0_41352545";
$pass = "w4gnz052ZY";
$db   = "if0_41352545_museum_db"; 

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>