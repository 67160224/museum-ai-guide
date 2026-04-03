// 1. ใส่ค่าของโปรเจคคุณเหมือนเดิม
const supabaseUrl = 'https://poderwfuvejrsrqydcbj.supabase.co' ;
const supabaseKey = 'sb_publishable_3FtM0O9-55E0OM_Xl7gJ4g_Wlp_NXen';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. ฟังก์ชันตรวจสอบว่าผู้ใช้ล็อคอินหรือยัง
async function checkUser() {
    const { data: { session } } = await supabase.auth.getSession();
    
    // ดึงข้อมูลว่าเคยกดปุ่มเข้าแบบ Guest ไว้หรือเปล่า
    const isGuest = localStorage.getItem('guestMode');
    
    if (!session && !isGuest) {
        // ถ้ายังไม่ได้ล็อคอิน และไม่ได้เข้าแบบ Guest ให้เด้งกลับไปหน้า login ทันที
        window.location.href = "login.html";
    } else if (session) {
        // กรณีล็อคอินสำเร็จด้วย Email หรือ Google
        console.log("ยินดีต้อนรับ:", session.user.email);
        const userDisplay = document.getElementById("user-display");
        if(userDisplay) {
            userDisplay.innerText = session.user.email;
        }
        localStorage.removeItem('guestMode'); // ล้างสถานะ Guest เผื่อเคยใช้ไว้
    } else if (isGuest) {
        // กรณีเข้าใช้งานแบบ Guest
        console.log("ยินดีต้อนรับ: ผู้เยี่ยมชม");
        const userDisplay = document.getElementById("user-display");
        if(userDisplay) {
            userDisplay.innerText = "ผู้เยี่ยมชม (Guest)";
        }
    }
}

// 3. ฟังก์ชันออกจากระบบ
async function logout() {
    await supabase.auth.signOut();
    localStorage.removeItem('guestMode'); // ล้างสถานะ Guest ด้วย
    window.location.href = "login.html"; // เด้งไปหน้าล็อคอิน
}

// สั่งให้ทำงานทันทีที่โหลดหน้าเว็บ
checkUser();
