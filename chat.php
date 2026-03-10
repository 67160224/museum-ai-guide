<?php

header("Content-Type: application/json; charset=UTF-8");

$apiKey = "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";

$message = trim($_POST["message"] ?? "");


/* ตรวจภาษาจากข้อความ */

function detectLanguage($text)
{
    if (preg_match('/[\x{4e00}-\x{9fff}]/u', $text)) {
        return "zh";
    }

    if (preg_match('/[a-zA-Z]/', $text)) {
        return "en";
    }

    return "th";
}

$language = detectLanguage($message);


if ($message === "") {

    echo json_encode([
        "reply" => "กรุณาพิมพ์ข้อความ"
    ]);

    exit;
}


/* Prompt แยกตามภาษา */

if ($language === "zh") {

    $systemPrompt = "
你是博物馆AI导览助手。
必须只使用中文回答。
不要使用英文或泰文。
回答要清楚、自然。
";

}

elseif ($language === "en") {

    $systemPrompt = "
You are a museum AI guide.
You MUST reply ONLY in English.
Do not use Thai or Chinese.
Answer clearly like a museum guide.
";

}

else {

    $systemPrompt = "
คุณคือ AI ไกด์นำชมพิพิธภัณฑ์
ต้องตอบเป็นภาษาไทยเท่านั้น
ห้ามใช้ภาษาอังกฤษหรือจีน
ตอบให้เข้าใจง่ายเหมือนไกด์พิพิธภัณฑ์
";

}


$url = "https://openrouter.ai/api/v1/chat/completions";


$data = [

    "model" => "meta-llama/llama-3-8b-instruct",

    "messages" => [

        [
            "role" => "system",
            "content" => $systemPrompt
        ],

        [
            "role" => "user",
            "content" => $message
        ]

    ],

    "temperature" => 0.6,
    "max_tokens" => 500

];


$ch = curl_init($url);

curl_setopt_array($ch, [

    CURLOPT_RETURNTRANSFER => true,

    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "Authorization: Bearer " . $apiKey,
        "HTTP-Referer: http://localhost",
        "X-Title: Museum AI Guide"
    ],

    CURLOPT_POST => true,

    CURLOPT_POSTFIELDS => json_encode($data),

    CURLOPT_TIMEOUT => 30

]);


$response = curl_exec($ch);


if (curl_errno($ch)) {

    $error = curl_error($ch);

    curl_close($ch);

    echo json_encode([
        "reply" => "Server Error : " . $error
    ]);

    exit;

}


$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

curl_close($ch);


if ($httpCode !== 200) {

    echo json_encode([
        "reply" => "API HTTP Error : " . $httpCode
    ]);

    exit;

}


$result = json_decode($response, true);


if (!$result) {

    echo json_encode([
        "reply" => "JSON Decode Error"
    ]);

    exit;

}


if (isset($result["error"])) {

    echo json_encode([
        "reply" => "OpenRouter Error : " . $result["error"]["message"]
    ]);

    exit;

}


$reply = $result["choices"][0]["message"]["content"] ?? "";


if (!$reply) {

    echo json_encode([
        "reply" => "AI ไม่ส่งคำตอบกลับมา"
    ]);

    exit;

}


echo json_encode([
    "reply" => trim($reply)
], JSON_UNESCAPED_UNICODE);