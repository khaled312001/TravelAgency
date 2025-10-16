@echo off
echo تحديث قاعدة البيانات للملف الشخصي...
echo.

REM تشغيل سكريبت تحديث قاعدة البيانات
node -e "
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDatabase() {
  try {
    console.log('بدء تحديث قاعدة البيانات...');
    
    // تحديث جدول admin_users
    const { error: alterError } = await supabase.rpc('exec_sql', {
      sql: \`
        ALTER TABLE admin_users 
        ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
        ADD COLUMN IF NOT EXISTS position VARCHAR(255),
        ADD COLUMN IF NOT EXISTS department VARCHAR(100),
        ADD COLUMN IF NOT EXISTS birth_date DATE,
        ADD COLUMN IF NOT EXISTS avatar_url TEXT,
        ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
        ADD COLUMN IF NOT EXISTS security_settings JSONB DEFAULT '{}';
      \`
    });
    
    if (alterError) {
      console.log('خطأ في تحديث الجدول:', alterError.message);
    } else {
      console.log('تم تحديث هيكل الجدول بنجاح');
    }
    
    // تحديث الحساب الإداري
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({
        email: 'info@worldtripagency.com',
        name: 'مدير النظام',
        phone: '+966500982394',
        position: 'مدير عام',
        department: 'الإدارة',
        birth_date: '1990-01-01',
        preferences: {
          darkMode: false,
          language: 'ar',
          timezone: 'Asia/Riyadh',
          emailNotifications: true,
          systemNotifications: true,
          bookingNotifications: true
        },
        security_settings: {
          twoFactor: false,
          loginNotifications: true
        }
      })
      .eq('email', 'admin@wonderland.com');
    
    if (updateError) {
      console.log('خطأ في تحديث الحساب:', updateError.message);
    } else {
      console.log('تم تحديث الحساب الإداري بنجاح');
    }
    
    // إنشاء حساب جديد إذا لم يكن موجود
    const { error: insertError } = await supabase
      .from('admin_users')
      .upsert({
        email: 'info@worldtripagency.com',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        name: 'مدير النظام',
        role: 'super_admin',
        phone: '+966500982394',
        position: 'مدير عام',
        department: 'الإدارة',
        birth_date: '1990-01-01',
        preferences: {
          darkMode: false,
          language: 'ar',
          timezone: 'Asia/Riyadh',
          emailNotifications: true,
          systemNotifications: true,
          bookingNotifications: true
        },
        security_settings: {
          twoFactor: false,
          loginNotifications: true
        }
      }, { onConflict: 'email' });
    
    if (insertError) {
      console.log('خطأ في إنشاء الحساب:', insertError.message);
    } else {
      console.log('تم إنشاء/تحديث الحساب الإداري بنجاح');
    }
    
    console.log('تم الانتهاء من تحديث قاعدة البيانات');
    
  } catch (error) {
    console.error('خطأ عام:', error.message);
  }
}

updateDatabase();
"

echo.
echo تم الانتهاء من التحديث!
pause
