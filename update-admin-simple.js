import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateAdmin() {
  try {
    console.log('بدء تحديث الحساب الإداري...');
    
    // 1. تحديث الحساب الحالي
    console.log('1. تحديث الحساب الإداري الحالي...');
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({
        email: 'info@worldtripagency.com',
        name: 'مدير النظام'
      })
      .eq('email', 'info@worldtripagency.com');
    
    if (updateError) {
      console.log('خطأ في تحديث الحساب:', updateError.message);
    } else {
      console.log('✓ تم تحديث الحساب الإداري بنجاح');
    }
    
    // 2. إنشاء حساب جديد
    console.log('2. إنشاء حساب إداري جديد...');
    const { error: insertError } = await supabase
      .from('admin_users')
      .insert({
        email: 'info@worldtripagency.com',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        name: 'مدير النظام',
        role: 'super_admin'
      });
    
    if (insertError) {
      console.log('خطأ في إنشاء الحساب (قد يكون موجود بالفعل):', insertError.message);
    } else {
      console.log('✓ تم إنشاء الحساب الإداري بنجاح');
    }
    
    // 3. التحقق من النتيجة
    console.log('3. التحقق من النتيجة...');
    const { data: adminUsers, error: fetchError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', 'info@worldtripagency.com');
    
    if (fetchError) {
      console.log('خطأ في جلب البيانات:', fetchError.message);
    } else if (adminUsers && adminUsers.length > 0) {
      console.log('✓ تم العثور على الحساب الإداري:', adminUsers[0]?.name);
      console.log('  - البريد الإلكتروني:', adminUsers[0]?.email);
      console.log('  - الدور:', adminUsers[0]?.role);
    } else {
      console.log('لم يتم العثور على الحساب الإداري');
    }
    
    console.log('\n🎉 تم الانتهاء من التحديث!');
    console.log('\nيمكنك الآن تسجيل الدخول باستخدام:');
    console.log('البريد الإلكتروني: info@worldtripagency.com');
    console.log('كلمة المرور: admin123');
    
  } catch (error) {
    console.error('❌ خطأ عام:', error.message);
  }
}

updateAdmin();
