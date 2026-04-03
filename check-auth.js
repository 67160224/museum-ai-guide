// ใช้ var และเปลี่ยนชื่อตัวแปรเป็น supabaseAuthClient เพื่อไม่ให้ชื่อซ้ำกับไฟล์อื่น
var mySupabaseUrl = 'https://poderwfuvejrsrqydcbj.supabase.co';
var mySupabaseKey = 'sb_publishable_3FtM0O9-55E0OM_Xl7gJ4g_Wlp_NXen';
var supabaseAuthClient = window.supabase.createClient(mySupabaseUrl, mySupabaseKey);

// ฟังก์ชันตรวจสอบว่าผู้ใช้ล็อคอินหรือยัง
async function checkUser() {
    // สังเกตว่าเราใช้ supabaseAuthClient แทนคำว่า supabase เฉยๆ แล้ว
    const { data: { session } } = await supabaseAuthClient.auth.getSession();
    
    // ดึงข้อมูลว่าเคยกดปุ่มเข้าแบบ Guest ไว้หรือเปล่า
    const isGuest = localStorage.getItem('guestMode');
    
    if (!session && !isGuest) {
        // ถ้ายังไม่ได้ล็อคอิน และไม่ได้เข้าแบบ Guest ให้เด้งกลับไปหน้า login ทันที
        window.location.href = "login.html";
    } else if (session) {
        // กรณีล็อคอินสำเร็จ
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

// ฟังก์ชันออกจากระบบ
async function logout() {
    await supabaseAuthClient.auth.signOut();
    localStorage.removeItem('guestMode'); // ล้างสถานะ Guest ด้วย
    window.location.href = "login.html"; // เด้งไปหน้าล็อคอิน
}

// สั่งให้ทำงานทันทีที่โหลดหน้าเว็บ
checkUser();
