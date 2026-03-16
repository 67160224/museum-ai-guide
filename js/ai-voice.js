// ===============================
// 🎧 REALISTIC AI MUSEUM GUIDE v8
// Mobile Stable Version
// ===============================

let availableVoices=[];
let ambientAudio=null;

let isPlaying=false;
let isPaused=false;

function loadVoices(){
    availableVoices=speechSynthesis.getVoices();
}

speechSynthesis.onvoiceschanged=loadVoices;
loadVoices();

// โหลดซ้ำ (แก้ Android Chrome)
setTimeout(loadVoices,1000);
setTimeout(loadVoices,2000);

document.addEventListener("DOMContentLoaded",()=>{

ambientAudio=document.getElementById("ambientSound");

if(ambientAudio){
    ambientAudio.volume=0;
}

// ===============================
// AMBIENT SOUND
// ===============================

function fadeInAmbient(){

    if(!ambientAudio) return;

    ambientAudio.play().catch(()=>{});

    let v=0;

    const fade=setInterval(()=>{

        if(v>=0.08){
            clearInterval(fade);
            return;
        }

        v+=0.004;
        ambientAudio.volume=v;

    },180);

}

function fadeOutAmbient(){

    if(!ambientAudio) return;

    let v=ambientAudio.volume;

    const fade=setInterval(()=>{

        if(v<=0){
            clearInterval(fade);
            ambientAudio.pause();
            return;
        }

        v-=0.004;
        ambientAudio.volume=v;

    },180);

}

// ===============================
// TEXT CLEAN
// ===============================

function cleanText(text){

    return text
    .replace(/\n/g," ")
    .replace(/\s+/g," ")
    .trim();

}

// ===============================
// SPLIT SENTENCES
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
// BUTTON TEXT
// ===============================

function getButtonText(lang){

    if(lang==="th"){
        return{
            play:"🎧 ฟังเสียง AI",
            pause:"⏸ หยุดชั่วคราว",
            resume:"▶ เล่นต่อ",
            stop:"⏹ หยุด"
        };
    }

    if(lang==="zh"){
        return{
            play:"🎧 AI语音导览",
            pause:"⏸ 暂停",
            resume:"▶ 继续",
            stop:"⏹ 停止"
        };
    }

    return{
        play:"🎧 Audio Guide",
        pause:"⏸ Pause",
        resume:"▶ Resume",
        stop:"⏹ Stop"
    };

}

// ===============================
// VOICE SELECT
// ===============================

function chooseVoice(lang){

    let voices=availableVoices.filter(v=>
        v.lang.toLowerCase().includes(lang)
    );

    return voices[0];

}

// ===============================
// SPEECH ENGINE
// ===============================

function speakParts(parts){

    let index=0;

    function speakNext(){

        if(!isPlaying) return;

        if(index>=parts.length){

            fadeOutAmbient();
            return;

        }

        const part=parts[index];

        const lang=detectLanguage(part.text);

        const utter=new SpeechSynthesisUtterance(part.text);

        utter.lang=
            lang==="th"?"th-TH":
            lang==="zh"?"zh-CN":"en-US";

        const voice=chooseVoice(lang);

        if(voice) utter.voice=voice;

        utter.rate=0.9;
        utter.pitch=1;
        utter.volume=1;

        utter.onend=()=>{

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
// PLAY
// ===============================

function playGuide(){

    if(!window.speechSynthesis){
        alert("อุปกรณ์นี้ไม่รองรับเสียง AI");
        return;
    }

    const desc=
    document.getElementById("description")?.textContent.trim() || "";

    if(!desc){
        alert("ไม่มีคำอธิบาย");
        return;
    }

    speechSynthesis.cancel();

    isPlaying=true;
    isPaused=false;

    fadeInAmbient();

    const sentences=splitSentences(cleanText(desc));

    const parts=[];

    sentences.forEach(s=>{

        parts.push({
            text:s.trim(),
            pause:900
        });

    });

    speakParts(parts);

}

// ===============================
// PAUSE
// ===============================

function pauseGuide(){

    speechSynthesis.pause();

    isPaused=true;

}

// ===============================
// RESUME
// ===============================

function resumeGuide(){

    speechSynthesis.resume();

    isPaused=false;

}

// ===============================
// STOP
// ===============================

function stopGuide(){

    isPlaying=false;
    isPaused=false;

    speechSynthesis.cancel();

    fadeOutAmbient();

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
    btn.style.fontWeight="bold";

}

// ===============================
// CREATE BUTTONS
// ===============================

function createButtons(){

    if(document.getElementById("aiSpeechBox")) return;

    const descElement=document.getElementById("description");

    if(!descElement) return;

    const desc=descElement.textContent||"";

    if(desc.trim()==="") return;

    const lang=detectLanguage(desc);

    const text=getButtonText(lang);

    const box=document.createElement("div");

    box.id="aiSpeechBox";
    box.style.margin="20px 0";
    box.style.textAlign="center";

    const playBtn=document.createElement("button");
    playBtn.innerText=text.play;
    playBtn.onclick=playGuide;
    styleButton(playBtn,"#1f2937");

    const pauseBtn=document.createElement("button");
    pauseBtn.innerText=text.pause;
    pauseBtn.onclick=pauseGuide;
    styleButton(pauseBtn,"#f39c12");

    const resumeBtn=document.createElement("button");
    resumeBtn.innerText=text.resume;
    resumeBtn.onclick=resumeGuide;
    styleButton(resumeBtn,"#16a085");

    const stopBtn=document.createElement("button");
    stopBtn.innerText=text.stop;
    stopBtn.onclick=stopGuide;
    styleButton(stopBtn,"#c0392b");

    box.appendChild(playBtn);
    box.appendChild(pauseBtn);
    box.appendChild(resumeBtn);
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

console.log("🎧 AI Museum Guide Ready (Mobile Stable)");

});
