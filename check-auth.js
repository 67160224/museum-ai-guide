// ==========================================
// check-auth.js: ระบบตรวจสอบสิทธิ์การเข้าใช้งาน
// ==========================================

async function checkUser() {
    // 1. ตรวจสอบ Session จาก Supabase (ใช้ตัวแปร supabase จาก config.js)
    const { data: { session } } = await supabase.auth.getSession();
    
    // 2. ตรวจสอบสถานะ Guest จาก LocalStorage
    const isGuest = localStorage.getItem('guestMode');
    
    // อ้างอิง Element ที่จะแสดงชื่อผู้ใช้ (ถ้ามี)
    const userDisplay = document.getElementById("user-display");

    // --- กรณีที่ 1: ไม่ได้ล็อคอิน และ ไม่ได้เข้าแบบ Guest ---
    if (!session && !isGuest) {
        // ถ้าหน้าปัจจุบันไม่ใช่หน้า login, register หรือ forgot-password ให้เด้งไปหน้า login
        const currentPage = window.location.pathname;
        if (!currentPage.includes("login.html") && 
            !currentPage.includes("register.html") && 
            !currentPage.includes("forgot-password.html") &&
            !currentPage.includes("update-password.html")) {
            window.location.href = "login.html";
        }
    } 
    
    // --- กรณีที่ 2: มีการล็อคอินจริง (Supabase Auth) ---
    else if (session) {
        console.log("เข้าใช้งานโดย:", session.user.email);
        if (userDisplay) {
            userDisplay.innerText = session.user.email;
        }
        // ล้างค่า guestMode ทิ้งเพราะมีการล็อคอินจริงแล้ว
        localStorage.removeItem('guestMode');
    } 
    
    // --- กรณีที่ 3: เข้าใช้งานแบบผู้เยี่ยมชม (Guest Mode) ---
    else if (isGuest) {
        console.log("เข้าใช้งานโดย: ผู้เยี่ยมชม");
        if (userDisplay) {
            userDisplay.innerText = "ผู้เยี่ยมชม (Guest)";
        }
    }
}

// ฟังก์ชันสำหรับออกจากระบบ
async function logout() {
    // ออกจากระบบ Supabase
    await supabase.auth.signOut();
    // ล้างสถานะ Guest
    localStorage.removeItem('guestMode');
    // เด้งกลับไปหน้า Login
    window.location.href = "login.html";
}

// สั่งให้ตรวจสอบทันทีที่โหลดไฟล์นี้
checkUser();
