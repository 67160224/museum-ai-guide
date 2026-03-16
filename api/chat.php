<?php

ini_set('display_errors',1);
error_reporting(E_ALL);

header("Content-Type: application/json; charset=UTF-8");

/* =====================================================
   CORS
===================================================== */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/* =====================================================
   DATABASE
===================================================== */

require __DIR__ . "/db.php";

/* =====================================================
   API KEY
===================================================== */

$apiKey = "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";

if(!$apiKey){
    echo json_encode(["reply"=>"Server config error"]);
    exit;
}

/* =====================================================
   GET MESSAGE (รองรับ FORM + JSON)
===================================================== */

$raw = file_get_contents("php://input");

$input = json_decode($raw,true);

if(!$input){
    parse_str($raw,$input);
}

$message = trim($input["message"] ?? "");

if($message === ""){
    echo json_encode([
        "reply"=>"Hello 👋 Welcome to Museum AI Guide"
    ]);
    exit;
}

/* =====================================================
   SEARCH ARTWORK
===================================================== */

$stmt = $conn->prepare("
SELECT title,artist,year,description
FROM artworks
WHERE
title LIKE CONCAT('%', ?, '%')
OR artist LIKE CONCAT('%', ?, '%')
OR description LIKE CONCAT('%', ?, '%')
LIMIT 1
");

$stmt->bind_param("sss",$message,$message,$message);

$stmt->execute();

/* ใช้ bind_result แทน get_result */

$stmt->bind_result($title,$artist,$year,$description);

$artwork = null;

if($stmt->fetch()){

    $artwork = [
        "title"=>$title,
        "artist"=>$artist,
        "year"=>$year,
        "description"=>$description
    ];
}

$stmt->close();

/* =====================================================
   CONTEXT
===================================================== */

if($artwork){

$context =
"Artwork Information:

Title: ".$artwork["title"]."
Artist: ".$artwork["artist"]."
Year: ".$artwork["year"]."
Description: ".$artwork["description"];

}else{

$context = "No artwork data found.";

}

/* =====================================================
   AI REQUEST
===================================================== */

$data = [
 "model"=>"meta-llama/llama-3-8b-instruct",
 "messages"=>[
   [
    "role"=>"system",
    "content"=>"You are a museum AI guide."
   ],
   [
    "role"=>"user",
    "content"=>$message."\n\n".$context
   ]
 ]
];

$ch = curl_init("https://openrouter.ai/api/v1/chat/completions");

curl_setopt_array($ch,[

 CURLOPT_RETURNTRANSFER=>true,
 CURLOPT_POST=>true,

 CURLOPT_HTTPHEADER=>[
   "Authorization: Bearer ".$apiKey,
   "Content-Type: application/json",
   "HTTP-Referer: https://museum-ai-guide.wasmer.app"
 ],

 CURLOPT_POSTFIELDS=>json_encode($data)

]);

$response = curl_exec($ch);

if($response === false){

 echo json_encode([
  "reply"=>"AI Error: ".curl_error($ch)
 ]);

 curl_close($ch);
 exit;
}

curl_close($ch);

$result = json_decode($response,true);

$reply = $result["choices"][0]["message"]["content"] ?? "AI ไม่ตอบกลับ";

echo json_encode([
 "reply"=>trim($reply)
],JSON_UNESCAPED_UNICODE);
