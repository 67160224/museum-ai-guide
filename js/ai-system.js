// ===============================
// 🧠 AI SYSTEM CONTROLLER
// เชื่อม Chat + Voice
// ===============================

const AISystem = (function(){

// ===============================
// 🔊 TEXT TO SPEECH
// ===============================

function speak(text, language="th"){

    if(!window.speechSynthesis){
        console.log("Speech not supported");
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    // เลือกเสียงตามภาษา
    if(language === "th"){
        speech.lang = "th-TH";
    }
    else if(language === "zh"){
        speech.lang = "zh-CN";
    }
    else{
        speech.lang = "en-US";
    }

    speech.rate = 1;
    speech.pitch = 1;

    speechSynthesis.speak(speech);

}


// ===============================
// 🔊 SPEAK ARTWORK
// ===============================

function speakArtwork(){

    const title =
    document.getElementById("title")?.innerText || "";

    const artist =
    document.getElementById("artist")?.innerText || "";

    const desc =
    document.getElementById("description")?.innerText || "";

    const text = `
    ผลงานนี้มีชื่อว่า ${title}
    สร้างโดย ${artist}
    ${desc}
    `;

    speak(text,"th");

}


// ===============================
// 💬 CHAT + VOICE
// ===============================

async function chat(message){

    const reply = await AIChat.send(message);

    // พูดคำตอบ
    speak(reply);

    return reply;

}


return {
    speakArtwork,
    chat
};

})();