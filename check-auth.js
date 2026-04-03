// 1. ใส่ค่าของโปรเจคคุณเหมือนเดิม
const supabaseUrl = 'https://poderwfuvejrsrqydcbj.supabase.co' ;
const supabaseKey = 'sb_publishable_3FtM0O9-55E0OM_Xl7gJ4g_Wlp_NXen';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

// 2. ฟังก์ชันตรวจสอบว่าผู้ใช้ล็อคอินหรือยัง
async function checkUser() {
    // ดึงข้อมูล session ปัจจุบัน
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
        // ถ้ายังไม่ได้ล็อคอิน ให้เด้งกลับไปหน้า login.html ทันที
        window.location.href = "login.html";
    } else {
        // ถ้าล็อคอินแล้ว ให้แสดงอีเมลในคอนโซล (และสามารถนำไปโชว์บนหน้าเว็บได้)
        console.log("ยินดีต้อนรับ:", session.user.email);
        
        // ถ้าคุณมีแท็ก <span id="user-display"></span> ใน html มันจะเอาอีเมลไปโชว์ให้
        const userDisplay = document.getElementById("user-display");
        if(userDisplay) {
            userDisplay.innerText = session.user.email;
        }
    }
}

// 3. ฟังก์ชันออกจากระบบ
async function logout() {
    await supabase.auth.signOut();
    window.location.href = "login.html"; // ออกจากระบบแล้วเด้งไปหน้าล็อคอิน
}

// สั่งให้ทำงานทันทีที่โหลดหน้าเว็บ
checkUser();
