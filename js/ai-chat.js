// ===============================
// 🤖 AI CHAT ENGINE
// ===============================

const AIChat = (function(){

// ===============================
// Detect Language
// ===============================

function detectLanguage(text){

    if(/[\u4e00-\u9fff]/.test(text)){
        return "zh";
    }

    if(/[a-zA-Z]/.test(text)){
        return "en";
    }

    return "th";
}


// ===============================
// System Prompt
// ===============================

function getPrompt(lang){

    if(lang === "zh"){
        return `
你是博物馆AI导览助手。
必须只使用中文回答。
不要使用英文或泰文。
回答要清楚自然。
`;
    }

    if(lang === "en"){
        return `
You are a museum AI guide.
Reply ONLY in English.
Do not use Thai or Chinese.
Explain clearly like a museum guide.
`;
    }

    return `
คุณคือ AI ไกด์นำชมพิพิธภัณฑ์
ต้องตอบเป็นภาษาไทยเท่านั้น
ห้ามใช้ภาษาอังกฤษหรือจีน
ตอบให้เข้าใจง่ายเหมือนไกด์พิพิธภัณฑ์
`;
}


// ===============================
// Send Message
// ===============================

async function send(message){

    if(!message){
        return "กรุณาพิมพ์ข้อความ";
    }

    const language = detectLanguage(message);

    const systemPrompt = getPrompt(language);

    try{

        const response = await fetch(
            "https://museumguide.67160224.workers.dev/",
            {
                method:"POST",

                mode:"cors",

                headers:{
                    "Content-Type":"application/json",
                    "Accept":"application/json"
                },

                body:JSON.stringify({
                    message: message,
                    language: language,
                    prompt: systemPrompt
                })

            }
        );

        if(!response.ok){
            console.error("HTTP ERROR:",response.status);
            return "AI Error : HTTP " + response.status;
        }

        const data = await response.json();

        if(!data || !data.reply){
            console.error("Invalid AI response:",data);
            return "AI ไม่ส่งคำตอบกลับมา";
        }

        return data.reply.trim();

    }
    catch(err){

        console.error("AI CONNECT ERROR:",err);

        return "AI Error : ไม่สามารถเชื่อมต่อ AI ได้";

    }

}

return {
    send
};

})();