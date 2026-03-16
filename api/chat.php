<?php

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

include "db.php";

/* =====================================================
   API KEY
===================================================== */

$apiKey = "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";

if (!$apiKey) {
    echo json_encode(["reply" => "Server config error"]);
    exit;
}

/* =====================================================
   METHOD CHECK
===================================================== */

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["reply" => "Method not allowed"]);
    exit;
}

/* =====================================================
   GET MESSAGE
===================================================== */

$input = json_decode(file_get_contents("php://input"), true);
$message = trim($input["message"] ?? "");

if ($message === "") {

    $langHeader = $_SERVER['HTTP_ACCEPT_LANGUAGE'] ?? "";

    if (strpos($langHeader, "zh") !== false) {

        $reply = "你好 👋 欢迎来到 Museum AI Guide\n\n你可以：\n• 输入艺术品名称\n• 询问博物馆信息\n• 或扫描 QR 码查看展品";

    }
    elseif (strpos($langHeader, "en") !== false) {

        $reply = "Hello 👋 Welcome to Museum AI Guide\n\nYou can:\n• Type the artwork name\n• Ask about the museum\n• Or scan a QR code to view the exhibit";

    }
    else {

        $reply = "สวัสดี 👋 ยินดีต้อนรับสู่ Museum AI Guide\n\nคุณสามารถ:\n• พิมพ์ชื่อผลงาน\n• ถามข้อมูลเกี่ยวกับพิพิธภัณฑ์\n• หรือสแกน QR เพื่อดูข้อมูลผลงาน";

    }

    echo json_encode(["reply"=>$reply], JSON_UNESCAPED_UNICODE);
    exit;
}

/* =====================================================
   LANGUAGE DETECT
===================================================== */

function detectLanguage($text)
{
    if (preg_match('/[\x{4e00}-\x{9fff}]/u', $text)) return "zh";
    if (preg_match('/[a-zA-Z]/', $text)) return "en";
    return "th";
}

$lang = detectLanguage($message);

/* =====================================================
   SEARCH ARTWORK IN DATABASE
===================================================== */

$stmt = $conn->prepare("
SELECT title, artist, year, description
FROM artworks
WHERE
title LIKE CONCAT('%', ?, '%')
OR artist LIKE CONCAT('%', ?, '%')
OR description LIKE CONCAT('%', ?, '%')
LIMIT 1
");

$stmt->bind_param("sss",$message,$message,$message);
$stmt->execute();

$result = $stmt->get_result();
$artwork = $result->fetch_assoc();

/* =====================================================
   CONTEXT FOR AI
===================================================== */

if($artwork){

$context = "
Artwork Information:

Title: ".$artwork["title"]."
Artist: ".$artwork["artist"]."
Year: ".$artwork["year"]."
Description: ".$artwork["description"]."
";

}else{

$context = "No specific artwork found in database.";

}

/* =====================================================
   SYSTEM PROMPT
===================================================== */

if ($lang === "zh") {

$systemPrompt = "你是博物馆AI导览助手。使用提供的艺术品信息回答。如果没有信息，也可以一般性回答。";

}
elseif ($lang === "en") {

$systemPrompt = "You are a museum AI guide. Use the artwork information if provided. If not, answer normally about art.";

}
else {

$systemPrompt = "คุณคือ AI ไกด์นำชมพิพิธภัณฑ์ ใช้ข้อมูลผลงานที่ให้มาในการตอบ หากไม่มีข้อมูลก็สามารถตอบทั่วไปเกี่ยวกับศิลปะได้";

}

/* =====================================================
   REQUEST DATA
===================================================== */

$data = [
    "model" => "meta-llama/llama-3-8b-instruct",
    "messages" => [
        [
            "role" => "system",
            "content" => $systemPrompt
        ],
        [
            "role" => "user",
            "content" => $message . "\n\n" . $context
        ]
    ],
    "temperature" => 0.6,
    "max_tokens" => 500
];

/* =====================================================
   CALL OPENROUTER
===================================================== */

$ch = curl_init("https://openrouter.ai/api/v1/chat/completions");

curl_setopt_array($ch, [

    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_TIMEOUT => 30,

    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer " . $apiKey,
        "Content-Type: application/json",
        "HTTP-Referer: https://museum-ai-guide.wasmer.app",
        "X-Title: Museum AI Guide"
    ],

    CURLOPT_POSTFIELDS => json_encode($data)

]);

$response = curl_exec($ch);

/* =====================================================
   ERROR HANDLE
===================================================== */

if ($response === false) {

    echo json_encode([
        "reply" => "AI Error: " . curl_error($ch)
    ]);

    curl_close($ch);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {

    echo json_encode([
        "reply" => "API HTTP Error: " . $httpCode
    ]);

    exit;
}

/* =====================================================
   PARSE RESULT
===================================================== */

$result = json_decode($response, true);
$reply = $result["choices"][0]["message"]["content"] ?? "AI ไม่ตอบกลับ";

echo json_encode([
    "reply" => trim($reply)
], JSON_UNESCAPED_UNICODE);
