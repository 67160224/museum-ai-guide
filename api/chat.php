<?php

header("Content-Type: application/json; charset=UTF-8");

/* =========================
   OPENROUTER API
========================= */

$apiKey = "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";

/* =========================
   RECEIVE MESSAGE
========================= */

$raw = file_get_contents("php://input");
parse_str($raw,$input);

$message = trim($input["message"] ?? "");
$language = trim($input["language"] ?? "th");

if($message==""){
 echo json_encode([
  "reply"=>"Hello 👋 Welcome to Museum AI Guide"
 ]);
 exit;
}

/* =====================================================
   SEARCH ARTWORK (Supabase)
===================================================== */

$SUPABASE_URL = "https://poderwfuvejrsrqydcbj.supabase.co";
$SUPABASE_KEY = "sb_publishable_3FtM0O9-55E0OM_Xl7gJ4g_Wlp_NXen";

$search = urlencode($message);

$url = $SUPABASE_URL."/rest/v1/artworks?or=(title.ilike.%".$search."%,artist.ilike.%".$search."%,description_th.ilike.%".$search."%)&limit=1";

$headers = [
 "apikey: ".$SUPABASE_KEY,
 "Authorization: Bearer ".$SUPABASE_KEY
];

$ch = curl_init($url);

curl_setopt_array($ch,[
 CURLOPT_RETURNTRANSFER => true,
 CURLOPT_HTTPHEADER => $headers
]);

$response = curl_exec($ch);
curl_close($ch);

$data = json_decode($response,true);

$context = "No artwork data found.";

if($data && count($data)>0){

$row = $data[0];

$context =
"Artwork Information:

Title: ".$row["title"]."
Artist: ".$row["artist"]."
Year: ".$row["year"]."
Description: ".$row["description_th"];

}

/* =========================
   LANGUAGE
========================= */

if($language=="zh"){
 $langPrompt="Answer in Chinese.";
}
elseif($language=="en"){
 $langPrompt="Answer in English.";
}
else{
 $langPrompt="Answer in Thai.";
}

/* =========================
   AI REQUEST
========================= */

$data = [

 "model"=>"openrouter/auto",

 "messages"=>[
  [
   "role"=>"system",
   "content"=>"You are a museum AI guide. ".$langPrompt
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
  "Content-Type: application/json"
 ],

 CURLOPT_POSTFIELDS=>json_encode($data)

]);

$response = curl_exec($ch);

if($response===false){

 echo json_encode([
  "reply"=>"AI Error: ".curl_error($ch)
 ]);

 curl_close($ch);
 exit;

}

curl_close($ch);

$result = json_decode($response,true);

if(isset($result["error"])){

 echo json_encode([
  "reply"=>"AI Error: ".$result["error"]["message"]
 ]);
 exit;

}

$reply = $result["choices"][0]["message"]["content"] ?? null;

if(!$reply){

 echo json_encode([
  "reply"=>"AI ไม่ตอบกลับ"
 ]);
 exit;

}

echo json_encode([
 "reply"=>trim($reply)
],JSON_UNESCAPED_UNICODE);
