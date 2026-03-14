<?php

$host = "localhost";
$user = "s67160224";
$pass = "gB848KVc";
$db   = "s67160224";

$conn = new mysqli($host, $user, $pass, $db);
$conn->set_charset("utf8mb4");

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

?>
