// ===============================
// 🎧 REALISTIC AI MUSEUM GUIDE v7
// Auto UI Language (TH / EN / CN)
// ===============================

let availableVoices = [];
let ambientAudio = null;
let isPlaying = false;

function loadVoices(){
    availableVoices = speechSynthesis.getVoices();
}

speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

document.addEventListener("DOMContentLoaded",()=>{

// ===============================
// 🎼 GET AMBIENT AUDIO
// ===============================

ambientAudio = document.getElementById("ambientSound");

if(ambientAudio){
    ambientAudio.volume = 0;
}

// ===============================
// 🎼 AMBIENT SOUND
// ===============================

function fadeInAmbient(){

    if(!ambientAudio) return;

    ambientAudio.play().catch(()=>{});

    let v = ambientAudio.volume || 0;

    const fade = setInterval(()=>{

        if(v >= 0.08){
            clearInterval(fade);
            return;
        }

        v += 0.004;
        ambientAudio.volume = v;

    },180);

}

function fadeOutAmbient(){

    if(!ambientAudio) return;

    let v = ambientAudio.volume;

    const fade = setInterval(()=>{

        if(v <= 0){
            clearInterval(fade);
            ambientAudio.pause();
            return;
        }

        v -= 0.004;
        ambientAudio.volume = v;

    },180);

}

// ===============================
// 🧠 CLEAN TEXT
// ===============================

function cleanText(text){

    return text
    .replace(/\n/g," ")
    .replace(/\s+/g," ")
    .trim();

}

// ===============================
// 🧠 SPLIT SENTENCE
// ===============================

function splitSentences(text){

    const sentences = text.match(/[^.!?。！？]+[.!?。！？]+/g);

    if(sentences) return sentences;

    return [text];

}

// ===============================
// 🌐 LANGUAGE DETECT
// ===============================

function detectLanguage(text){

    if(/[\u0E00-\u0E7F]/.test(text)){
        return "th";
    }

    if(/[\u4E00-\u9FFF]/.test(text)){
        return "zh";
    }

    return "en";

}

// ===============================
// 🌐 BUTTON TEXT
// ===============================

function getButtonText(lang){

    if(lang==="th"){
        return {
            play:"🎧 ฟังเสียง AI",
            stop:"⏹ หยุด"
        };
    }

    if(lang==="zh"){
        return {
            play:"🎧 AI 语音导览",
            stop:"⏹ 停止"
        };
    }

    return {
        play:"🎧 AI Audio Guide",
        stop:"⏹ Stop"
    };

}

// ===============================
// 🎙 FEMALE VOICE SELECT
// ===============================

function chooseVoice(lang){

    const femaleKeywords=[
        "female","woman","zira","samantha","victoria","karen","ting","mei"
    ];

    let voices = availableVoices.filter(v =>
        v.lang.toLowerCase().includes(lang)
    );

    let female = voices.find(v =>
        femaleKeywords.some(k =>
            v.name.toLowerCase().includes(k)
        )
    );

    if(female) return female;

    return voices[0];

}

// ===============================
// 🎙 SPEECH ENGINE
// ===============================

function speakParts(parts){

    let index = 0;

    function speakNext(){

        if(!isPlaying) return;

        if(index >= parts.length){

            fadeOutAmbient();
            return;

        }

        const part = parts[index];

        const lang = detectLanguage(part.text);

        const utter = new SpeechSynthesisUtterance(part.text);

        utter.lang = lang==="th" ? "th-TH" :
                     lang==="zh" ? "zh-CN" : "en-US";

        const voice = chooseVoice(lang);

        if(voice) utter.voice = voice;

        utter.rate = 0.85;
        utter.pitch = 1.05;
        utter.volume = 1;

        utter.onend = ()=>{

            index++;

            setTimeout(()=>{

                speakNext();

            },part.pause);

        };

        speechSynthesis.speak(utter);

    }

    speakNext();

}

// ===============================
// 🎧 PLAY GUIDE
// ===============================

function playGuide(){

    const desc =
    document.getElementById("description")?.textContent.trim() || "";

    if(!desc){
        alert("ไม่มีคำอธิบายให้อ่าน");
        return;
    }

    speechSynthesis.cancel();

    isPlaying = true;

    fadeInAmbient();

    const description = cleanText(desc);

    const speechParts = [];

    const sentences = splitSentences(description);

    sentences.forEach(s=>{

        speechParts.push({
            text:s.trim(),
            pause:900
        });

    });

    speakParts(speechParts);

}

// ===============================
// ⏹ STOP
// ===============================

function stopGuide(){

    isPlaying = false;

    speechSynthesis.cancel();

    fadeOutAmbient();

}

// ===============================
// 🎛 CREATE BUTTONS
// ===============================

function createButtons(){

    if(document.getElementById("aiSpeechBox")) return;

    const chatBox=document.getElementById("chatBox");

    if(!chatBox) return;

    const desc =
    document.getElementById("description")?.textContent || "";

    const lang = detectLanguage(desc);

    const text = getButtonText(lang);

    const box=document.createElement("div");

    box.id="aiSpeechBox";
    box.style.margin="15px 0";
    box.style.textAlign="center";

    const playBtn=document.createElement("button");

    playBtn.innerText=text.play;
    playBtn.onclick=playGuide;

    styleButton(playBtn,"#1f2937");

    const stopBtn=document.createElement("button");

    stopBtn.innerText=text.stop;
    stopBtn.onclick=stopGuide;

    styleButton(stopBtn,"#c0392b");

    box.appendChild(playBtn);
    box.appendChild(stopBtn);

    chatBox.parentNode.insertBefore(box,chatBox);

}

// ===============================
// 🎨 BUTTON STYLE
// ===============================

function styleButton(btn,color){

    btn.style.padding="10px 18px";
    btn.style.margin="0 5px";
    btn.style.background=color;
    btn.style.color="white";
    btn.style.border="none";
    btn.style.borderRadius="8px";
    btn.style.cursor="pointer";
    btn.style.fontWeight="bold";

}

// ===============================
// Hook Artwork Loader
// ===============================

const originalDisplayArtwork = window.displayArtwork;

if(typeof originalDisplayArtwork==="function"){

    window.displayArtwork=function(data){

        const old=document.getElementById("aiSpeechBox");
        if(old) old.remove();

        originalDisplayArtwork(data);

        setTimeout(createButtons,150);

    };

}

console.log("🎧 AI Museum Guide Ready (Auto Language UI)");

});