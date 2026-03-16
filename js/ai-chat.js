// ===============================
// 🤖 AI CHAT ENGINE
// ===============================

const AIChat = (function(){

let isSending = false;

// -------------------------------
// Detect Language
// -------------------------------

function detectLanguage(text){

    if(/[\u4e00-\u9fff]/.test(text)){
        return "zh";
    }

    if(/[a-zA-Z]/.test(text)){
        return "en";
    }

    return "th";
}

// -------------------------------
// Send Message
// -------------------------------

async function send(message){

    if(!message){
        return "กรุณาพิมพ์ข้อความ";
    }

    if(isSending){
        return "AI กำลังตอบอยู่...";
    }

    isSending = true;

    const language = detectLanguage(message);

    try{

        const response = await fetch("/api/chat.php",{
            method:"POST",
            headers:{
                "Content-Type":"application/x-www-form-urlencoded"
            },
            body:
            "message="+encodeURIComponent(message)+
            "&language="+encodeURIComponent(language)
        });

        if(!response.ok){
            isSending = false;
            return "AI Error : HTTP " + response.status;
        }

        const data = await response.json();

        isSending = false;

        if(!data.reply){
            return "AI ไม่ส่งคำตอบกลับมา";
        }

        return data.reply;

    }
    catch(err){

        console.error(err);
        isSending = false;
        return "AI Error : ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้";

    }

}

return {
    send
};

})();
