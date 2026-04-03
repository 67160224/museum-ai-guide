// config.js
const SUPABASE_URL = 'https://poderwfuvejrsrqydcbj.supabase.co';
const SUPABASE_KEY = 'sb_publishable_3FtM0O9-55E0OM_Xl7gJ4g_Wlp_NXen';

// สร้างตัวแปรกลางที่ใช้ร่วมกัน
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
