// 1. เปลี่ยนการประกาศตัวแปรเป็น var เพื่อป้องกันการ Error หากเผลอโหลดไฟล์ซ้ำ
var mySupabaseUrl = 'https://poderwfuvejrsrqydcbj.supabase.co';
var mySupabaseKey = 'sb_publishable_3FtM0O9-55E0OM_Xl7gJ4g_Wlp_NXen';
var supabaseClient = window.supabase.createClient(mySupabaseUrl, mySupabaseKey);

// 2. ฟังก์ชันตรวจสอบสิทธิ์
async function checkUser() {
    const { data: { session } } = await supabaseClient.auth.getSession();
    
    const isGuest = localStorage.getItem('guestMode');
    
    if (!session && !isGuest) {
        // ถ้ายังไม่ได้ล็อคอิน และไม่ได้เข้าแบบ Guest ให้เด้งกลับไปหน้า login ทันที
        window.location.href = "login.html";
    } else if (session) {
        // ล็อคอินสำเร็จ
        console.log("ยินดีต้อนรับ:", session.user.email);
        const userDisplay = document.getElementById("user-display");
        if(userDisplay) {
            userDisplay.innerText = session.user.email;
        }
        localStorage.removeItem('guestMode');
    } else if (isGuest) {
        // เข้าแบบ Guest
        console.log("ยินดีต้อนรับ: ผู้เยี่ยมชม");
        const userDisplay = document.getElementById("user-display");
        if(userDisplay) {
            userDisplay.innerText = "ผู้เยี่ยมชม (Guest)";
        }
    }
}

// 3. ฟังก์ชันออกจากระบบ
async function logout() {
    await supabaseClient.auth.signOut();
    localStorage.removeItem('guestMode'); // ล้างสถานะ Guest ออกด้วย
    window.location.href = "login.html"; // เด้งไปหน้าล็อคอิน
}

// สั่งให้เช็คทันทีที่เปิดหน้าเว็บ
checkUser();
