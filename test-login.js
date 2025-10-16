import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function testLogin() {
  try {
    console.log('اختبار تسجيل الدخول...');
    
    // 1. التحقق من وجود الحساب الإداري
    console.log('1. التحقق من وجود الحساب الإداري...');
    const { data: adminUsers, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'info@worldtripagency.com');
    
    if (fetchError) {
      console.log('خطأ في جلب البيانات:', fetchError.message);
      return;
    }
    
    if (!adminUsers || adminUsers.length === 0) {
      console.log('❌ لم يتم العثور على الحساب الإداري');
      return;
    }
    
    const admin = adminUsers[0];
    console.log('✓ تم العثور على الحساب الإداري:');
    console.log('  - الاسم:', admin.name);
    console.log('  - البريد الإلكتروني:', admin.email);
    console.log('  - الدور:', admin.role);
    console.log('  - نشط:', admin.is_active);
    
    // 2. اختبار تسجيل الدخول
    console.log('\n2. اختبار تسجيل الدخول...');
    
    // محاكاة تسجيل الدخول
    const loginData = {
      email: 'info@worldtripagency.com',
      password: 'admin123'
    };
    
    console.log('محاولة تسجيل الدخول بالبيانات:');
    console.log('  - البريد الإلكتروني:', loginData.email);
    console.log('  - كلمة المرور:', loginData.password);
    
    // 3. اختبار API تسجيل الدخول
    console.log('\n3. اختبار API تسجيل الدخول...');
    
    try {
      const response = await fetch('http://localhost:3000/api/admin/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        console.log('✓ تم تسجيل الدخول بنجاح!');
        console.log('  - المستخدم:', result.user.name);
        console.log('  - البريد الإلكتروني:', result.user.email);
        console.log('  - الدور:', result.user.role);
        console.log('  - آخر تسجيل دخول:', result.user.last_login);
      } else {
        console.log('❌ فشل في تسجيل الدخول:', result.message);
      }
    } catch (apiError) {
      console.log('❌ خطأ في API تسجيل الدخول:', apiError.message);
      console.log('تأكد من تشغيل الخادم المحلي على المنفذ 3000');
    }
    
    console.log('\n🎉 تم الانتهاء من الاختبار!');
    
  } catch (error) {
    console.error('❌ خطأ عام:', error.message);
  }
}

testLogin();