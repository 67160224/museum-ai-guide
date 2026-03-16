<?php

header("Content-Type: application/json; charset=UTF-8");

/* =====================================================
   CORS
===================================================== */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}


/* =====================================================
   API KEY (OpenRouter)
===================================================== */

$apiKey = "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";

if (!$apiKey) {
    echo json_encode(["reply" => "Server config error"]);
    exit;
}


/* =====================================================
   รับข้อความ
===================================================== */

$input = json_decode(file_get_contents("php://input"), true);

$message = trim($input["message"] ?? "");

if ($message === "") {
    echo json_encode(["reply" => "กรุณาพิมพ์ข้อความ"]);
    exit;
}


/* =====================================================
   Detect Language
===================================================== */

function detectLanguage($text)
{
    if (preg_match('/[\x{4e00}-\x{9fff}]/u', $text)) return "zh";
    if (preg_match('/[a-zA-Z]/', $text)) return "en";
    return "th";
}

$lang = detectLanguage($message);


/* =====================================================
   SYSTEM PROMPT
===================================================== */

if ($lang === "zh") {

$systemPrompt = "你是博物馆AI导览助手。必须只使用中文回答。";

}
elseif ($lang === "en") {

$systemPrompt = "You are a museum AI guide. Reply only in English.";

}
else {

$systemPrompt = "คุณคือ AI ไกด์นำชมพิพิธภัณฑ์ ตอบเป็นภาษาไทยเท่านั้น";

}


/* =====================================================
   REQUEST DATA
===================================================== */

$data = [
    "model" => "meta-llama/llama-3-8b-instruct",
    "messages" => [
        ["role" => "system", "content" => $systemPrompt],
        ["role" => "user", "content" => $message]
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
    CURLOPT_HTTPHEADER => [
        "Authorization: Bearer " . $apiKey,
        "Content-Type: application/json",
        "HTTP-Referer: https://museum-ai-guide.pages.dev",
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
