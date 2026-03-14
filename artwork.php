<?php

header("Content-Type: application/json; charset=UTF-8");

include "db.php";

/* -------------------------
   รับค่า ID
------------------------- */

$id = $_GET["id"] ?? "";

if(empty($id)){
    echo json_encode([
        "error" => "No ID"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/* -------------------------
   เตรียม Query
------------------------- */

$stmt = $conn->prepare("SELECT * FROM artworks WHERE id = ?");

if(!$stmt){
    echo json_encode([
        "error" => "SQL prepare failed"
    ]);
    exit;
}

/* -------------------------
   Bind + Execute
------------------------- */

$stmt->bind_param("s", $id);

if(!$stmt->execute()){
    echo json_encode([
        "error" => "SQL execute failed"
    ]);
    exit;
}

$result = $stmt->get_result();

if(!$result){
    echo json_encode([
        "error" => "Query error"
    ]);
    exit;
}

/* -------------------------
   Fetch Data
------------------------- */

$data = $result->fetch_assoc();

if(!$data){
    echo json_encode([
        "error" => "Artwork not found"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/* -------------------------
   ส่งข้อมูลกลับ
------------------------- */

echo json_encode($data, JSON_UNESCAPED_UNICODE);

/* -------------------------
   Close
------------------------- */

$stmt->close();
$conn->close();

?>
