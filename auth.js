// 1. ใส่ค่าของโปรเจคคุณ
const supabaseUrl = 'https://poderwfuvejrsrqydcbj.supabase.co' ;
const supabaseKey = 'sb_publishable_3FtM0O9-55E0OM_Xl7gJ4g_Wlp_NXen';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

let isLoginMode = true;

// 2. ฟังก์ชันสลับหน้าระหว่าง Login กับ Register (สำหรับอีเมล)
function toggleMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('form-title').innerText = isLoginMode ? "เข้าสู่ระบบ" : "สมัครสมาชิก";
    document.getElementById('submit-btn').innerText = isLoginMode ? "เข้าสู่ระบบด้วยอีเมล" : "สมัครสมาชิกด้วยอีเมล";
    document.querySelector('.toggle-text').innerText = isLoginMode ? "ยังไม่มีบัญชี? สมัครสมาชิกที่นี่" : "มีบัญชีแล้ว? เข้าสู่ระบบที่นี่";
    document.getElementById('message').innerText = "";
}

// 3. ฟังก์ชันล็อคอิน/สมัครสมาชิก ด้วย Email
async function handleAuth() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('message');

    if (!email || !password) {
        messageEl.innerText = "กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน";
        messageEl.style.color = "red";
        return;
    }

    messageEl.innerText = "กำลังประมวลผล...";
    messageEl.style.color = "blue";

    if (isLoginMode) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            messageEl.innerText = "เข้าสู่ระบบไม่สำเร็จ: " + error.message;
            messageEl.style.color = "red";
        } else {
            messageEl.innerText = "เข้าสู่ระบบสำเร็จ! กำลังพาไปหน้าหลัก...";
            messageEl.style.color = "green";
            setTimeout(() => { window.location.href = "index.html"; }, 1000);
        }
    } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) {
            messageEl.innerText = "สมัครสมาชิกไม่สำเร็จ: " + error.message;
            messageEl.style.color = "red";
        } else {
            messageEl.innerText = "สมัครสมาชิกสำเร็จ!";
            messageEl.style.color = "green";
            toggleMode();
        }
    }
}

// 4. ฟังก์ชันล็อคอินด้วย Google
async function loginWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
    });
}

// 5. ฟังก์ชันเข้าใช้งานแบบไม่ล็อคอิน (Guest Mode)
function continueAsGuest() {
    // เซฟสถานะลงเบราว์เซอร์ว่าเป็น Guest
    localStorage.setItem('guestMode', 'true');
    // ส่งไปหน้าหลักทันที
    window.location.href = "index.html";
}
