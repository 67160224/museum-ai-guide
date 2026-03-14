<?php
header("Content-Type: application/json; charset=UTF-8");

include "db.php";

$id = $_GET["id"] ?? "";

if(empty($id)){
    echo json_encode(["error"=>"No ID"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM artworks WHERE id = ?");
$stmt->bind_param("s",$id);
$stmt->execute();

$result = $stmt->get_result();
$data = $result->fetch_assoc();

if(!$data){
    echo json_encode(["error"=>"Artwork not found"]);
    exit;
}

echo json_encode($data, JSON_UNESCAPED_UNICODE);

$conn->close();
?>