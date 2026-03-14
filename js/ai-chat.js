// ===============================
// 🤖 AI CHAT ENGINE
// ===============================

const AIChat = (function(){

async function send(message, language="th"){

    const response = await fetch("https://museumguide.wuaze.com/chat.php",{
        method:"POST",
        headers:{
            "Content-Type":"application/x-www-form-urlencoded"
        },
        body:
        "message="+encodeURIComponent(message)+
        "&language="+encodeURIComponent(language)
    });

    if(!response.ok){
        throw new Error("Server Error");
    }

    const data = await response.json();

    return data.reply;

}

return {
    send
};

})();