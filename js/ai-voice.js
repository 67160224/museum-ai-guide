// ===============================
// 🎧 REALISTIC AI MUSEUM GUIDE v10
// Fix Thai Speech + Mobile
// ===============================

let availableVoices=[];
let ambientAudio=null;

let isPlaying=false;

function loadVoices(){
    availableVoices=speechSynthesis.getVoices();
}

speechSynthesis.onvoiceschanged=loadVoices;
loadVoices();

// โหลดซ้ำ (แก้ Chrome บางเครื่อง)
setTimeout(loadVoices,1000);
setTimeout(loadVoices,2000);

document.addEventListener("DOMContentLoaded",()=>{

ambientAudio=document.getElementById("ambientSound");

if(ambientAudio){
    ambientAudio.volume=0;
}

// ===============================
// CLEAN TEXT
// ===============================

function cleanText(text){

    return text
    .replace(/artwork:/ig,"")
    .replace(/作品:/ig,"")
    .replace(/ผลงาน:/ig,"")
    .replace(/\n/g," ")
    .replace(/\s+/g," ")
    .trim();

}

// ===============================
// SPLIT SENTENCE
// ===============================

function splitSentences(text){

    const s=text.match(/[^.!?。！？]+[.!?。！？]+/g);

    if(s) return s;

    return [text];

}

// ===============================
// LANGUAGE DETECT
// ===============================

function detectLanguage(text){

    if(/[\u0E00-\u0E7F]/.test(text)) return "th";

    if(/[\u4E00-\u9FFF]/.test(text)) return "zh";

    return "en";

}

// ===============================
// SELECT VOICE
// ===============================

function chooseVoice(lang){

    if(!availableVoices || availableVoices.length===0){
        return null;
    }

    if(lang==="th"){
        let thai=availableVoices.find(v=>v.lang==="th-TH");
        if(thai) return thai;
    }

    if(lang==="zh"){
        let zh=availableVoices.find(v=>v.lang.includes("zh"));
        if(zh) return zh;
    }

    if(lang==="en"){
        let en=availableVoices.find(v=>v.lang.includes("en"));
        if(en) return en;
    }

    return availableVoices[0];

}

// ===============================
// SPEECH ENGINE
// ===============================

function speakParts(parts){

    let index=0;

    function speakNext(){

        if(!isPlaying) return;

        if(index>=parts.length) return;

        const part=parts[index];

        const lang=detectLanguage(part.text);

        const utter=new SpeechSynthesisUtterance(part.text);

        utter.lang=
            lang==="th"?"th-TH":
            lang==="zh"?"zh-CN":"en-US";

        const voice=chooseVoice(lang);

        if(voice){
            utter.voice=voice;
        }

        utter.rate=0.9;
        utter.pitch=1;

        utter.onend=()=>{

            index++;

            setTimeout(()=>{

                speakNext();

            },800);

        };

        speechSynthesis.speak(utter);

    }

    speakNext();

}

// ===============================
// PLAY GUIDE
// ===============================

function playGuide(){

    if(!window.speechSynthesis){
        alert("อุปกรณ์นี้ไม่รองรับเสียง");
        return;
    }

    const descElement=document.getElementById("description");

    if(!descElement){
        alert("ไม่พบคำอธิบาย");
        return;
    }

    const desc=descElement.innerText.trim();

    if(!desc){
        alert("ไม่มีคำอธิบาย");
        return;
    }

    console.log("Speech text:",desc);
    console.log("Language:",detectLanguage(desc));

    speechSynthesis.cancel();

    isPlaying=true;

    const sentences=splitSentences(cleanText(desc));

    const parts=[];

    sentences.forEach(s=>{

        parts.push({
            text:s.trim()
        });

    });

    speakParts(parts);

}

// ===============================
// STOP
// ===============================

function stopGuide(){

    isPlaying=false;

    speechSynthesis.cancel();

}

// ===============================
// BUTTON STYLE
// ===============================

function styleButton(btn,color){

    btn.style.padding="10px 16px";
    btn.style.margin="4px";
    btn.style.background=color;
    btn.style.color="white";
    btn.style.border="none";
    btn.style.borderRadius="8px";
    btn.style.cursor="pointer";

}

// ===============================
// CREATE BUTTON
// ===============================

function createButtons(){

    if(document.getElementById("aiSpeechBox")) return;

    const descElement=document.getElementById("description");

    if(!descElement) return;

    const box=document.createElement("div");

    box.id="aiSpeechBox";
    box.style.margin="20px 0";
    box.style.textAlign="center";

    const playBtn=document.createElement("button");
    playBtn.innerText="🎧 Audio Guide";
    playBtn.onclick=playGuide;

    const stopBtn=document.createElement("button");
    stopBtn.innerText="⏹ Stop";
    stopBtn.onclick=stopGuide;

    styleButton(playBtn,"#1f2937");
    styleButton(stopBtn,"#c0392b");

    box.appendChild(playBtn);
    box.appendChild(stopBtn);

    descElement.parentNode.insertBefore(box,descElement.nextSibling);

}

// ===============================
// HOOK ARTWORK
// ===============================

const originalDisplayArtwork=window.displayArtwork;

if(typeof originalDisplayArtwork==="function"){

    window.displayArtwork=function(data){

        const old=document.getElementById("aiSpeechBox");

        if(old) old.remove();

        originalDisplayArtwork(data);

        setTimeout(createButtons,300);

    };

}

console.log("🎧 AI Museum Guide Ready v10");

});
