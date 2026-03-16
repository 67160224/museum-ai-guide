<?php

header("Content-Type: application/json; charset=UTF-8");

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
   เรียก Supabase API
------------------------- */

$SUPABASE_URL = "https://poderwfuvejrsrqydcbj.supabase.co";
$API_KEY = "sb_publishable_3FtM0O9-55E0OM_Xl7gJ4g_Wlp_NXen";

$url = $SUPABASE_URL . "/rest/v1/artworks?id=eq." . urlencode($id);

$headers = [
    "apikey: ".$API_KEY,
    "Authorization: Bearer ".$API_KEY,
    "Content-Type: application/json"
];

$ch = curl_init($url);

curl_setopt_array($ch,[
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => $headers
]);

$response = curl_exec($ch);

if($response === false){
    echo json_encode([
        "error" => "Supabase connection failed"
    ]);
    curl_close($ch);
    exit;
}

curl_close($ch);

$data = json_decode($response,true);

/* -------------------------
   Fetch Data
------------------------- */

if(!$data || count($data) === 0){
    echo json_encode([
        "error" => "Artwork not found"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

/* -------------------------
   ส่งข้อมูลกลับ
------------------------- */

echo json_encode($data[0], JSON_UNESCAPED_UNICODE);

?>
