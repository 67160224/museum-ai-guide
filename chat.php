<?php

header("Content-Type: application/json; charset=UTF-8");

/* -------------------------
   SECURITY SETTINGS
------------------------- */

$allowedOrigins = [
    "https://museumguide.wuaze.com",
    "https://museum-ai-guide.pages.dev"
];

if (isset($_SERVER['HTTP_ORIGIN']) && !in_array($_SERVER['HTTP_ORIGIN'], $allowedOrigins)) {
    echo json_encode(["reply"=>"Access denied"]);
    exit;
}

/* -------------------------
   API KEY (ควรเก็บใน ENV)
------------------------- */

$apiKey = getenv("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");

if(!$apiKey){
    echo json_encode(["reply"=>"Server config error"]);
    exit;
}

/* -------------------------
   รับข้อความ
------------------------- */

$message = trim($_POST["message"] ?? "");

if($message === ""){
    echo json_encode(["reply"=>"กรุณาพิมพ์ข้อความ"]);
    exit;
}

/* -------------------------
   Detect Language
------------------------- */

function detectLanguage($text){

    if(preg_match('/[\x{4e00}-\x{9fff}]/u',$text)){
        return "zh";
    }

    if(preg_match('/[a-zA-Z]/',$text)){
        return "en";
    }

    return "th";
}

$language = detectLanguage($message);

/* -------------------------
   System Prompt
------------------------- */

if($language === "zh"){

$systemPrompt = "
你是博物馆AI导览助手。
必须只使用中文回答。
不要使用英文或泰文。
回答要清楚自然。
";

}
elseif($language === "en"){

$systemPrompt = "
You are a museum AI guide.
Reply ONLY in English.
Do not use Thai or Chinese.
Explain clearly like a museum guide.
";

}
else{

$systemPrompt = "
คุณคือ AI ไกด์นำชมพิพิธภัณฑ์
ต้องตอบเป็นภาษาไทยเท่านั้น
ห้ามใช้ภาษาอังกฤษหรือจีน
ตอบให้เข้าใจง่ายเหมือนไกด์พิพิธภัณฑ์
";

}

/* -------------------------
   Request Data
------------------------- */

$data = [
    "model"=>"meta-llama/llama-3-8b-instruct",
    "messages"=>[
        ["role"=>"system","content"=>$systemPrompt],
        ["role"=>"user","content"=>$message]
    ],
    "temperature"=>0.6,
    "max_tokens"=>500
];

/* -------------------------
   Call OpenRouter
------------------------- */

$ch = curl_init("https://openrouter.ai/api/v1/chat/completions");

curl_setopt_array($ch,[
    CURLOPT_RETURNTRANSFER=>true,
    CURLOPT_TIMEOUT=>30,
    CURLOPT_POST=>true,
    CURLOPT_HTTPHEADER=>[
        "Content-Type: application/json",
        "Authorization: Bearer ".$apiKey
    ],
    CURLOPT_POSTFIELDS=>json_encode($data)
]);

$response = curl_exec($ch);

if($response === false){

    echo json_encode([
        "reply"=>"AI Error : ".curl_error($ch)
    ]);

    curl_close($ch);
    exit;
}

$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if($httpCode !== 200){
    echo json_encode([
        "reply"=>"API HTTP Error : ".$httpCode
    ]);
    exit;
}

/* -------------------------
   Parse Result
------------------------- */

$result = json_decode($response,true);

if(!$result){
    echo json_encode(["reply"=>"JSON Decode Error"]);
    exit;
}

if(isset($result["error"])){
    echo json_encode([
        "reply"=>"OpenRouter Error : ".$result["error"]["message"]
    ]);
    exit;
}

$reply = $result["choices"][0]["message"]["content"] ?? "";

if(!$reply){
    echo json_encode(["reply"=>"AI ไม่ส่งคำตอบกลับมา"]);
    exit;
}

echo json_encode([
    "reply"=>trim($reply)
], JSON_UNESCAPED_UNICODE);
