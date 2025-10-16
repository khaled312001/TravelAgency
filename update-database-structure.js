import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA';
const supabase = createClient(supabaseUrl, supabaseKey);

async function updateDatabaseStructure() {
  try {
    console.log('بدء تحديث هيكل قاعدة البيانات...');
    
    // 1. إضافة الحقول الجديدة إلى جدول admin_users
    console.log('1. إضافة الحقول الجديدة...');
    
    // إضافة حقل phone
    try {
      const { error: phoneError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);'
      });
      if (phoneError) console.log('خطأ في إضافة حقل phone:', phoneError.message);
      else console.log('✓ تم إضافة حقل phone');
    } catch (e) {
      console.log('خطأ في إضافة حقل phone:', e.message);
    }
    
    // إضافة حقل position
    try {
      const { error: positionError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS position VARCHAR(255);'
      });
      if (positionError) console.log('خطأ في إضافة حقل position:', positionError.message);
      else console.log('✓ تم إضافة حقل position');
    } catch (e) {
      console.log('خطأ في إضافة حقل position:', e.message);
    }
    
    // إضافة حقل department
    try {
      const { error: departmentError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS department VARCHAR(100);'
      });
      if (departmentError) console.log('خطأ في إضافة حقل department:', departmentError.message);
      else console.log('✓ تم إضافة حقل department');
    } catch (e) {
      console.log('خطأ في إضافة حقل department:', e.message);
    }
    
    // إضافة حقل birth_date
    try {
      const { error: birthDateError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS birth_date DATE;'
      });
      if (birthDateError) console.log('خطأ في إضافة حقل birth_date:', birthDateError.message);
      else console.log('✓ تم إضافة حقل birth_date');
    } catch (e) {
      console.log('خطأ في إضافة حقل birth_date:', e.message);
    }
    
    // إضافة حقل avatar_url
    try {
      const { error: avatarError } = await supabase.rpc('exec_sql', {
        sql: 'ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS avatar_url TEXT;'
      });
      if (avatarError) console.log('خطأ في إضافة حقل avatar_url:', avatarError.message);
      else console.log('✓ تم إضافة حقل avatar_url');
    } catch (e) {
      console.log('خطأ في إضافة حقل avatar_url:', e.message);
    }
    
    // إضافة حقل preferences
    try {
      const { error: preferencesError } = await supabase.rpc('exec_sql', {
        sql: "ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}';"
      });
      if (preferencesError) console.log('خطأ في إضافة حقل preferences:', preferencesError.message);
      else console.log('✓ تم إضافة حقل preferences');
    } catch (e) {
      console.log('خطأ في إضافة حقل preferences:', e.message);
    }
    
    // إضافة حقل security_settings
    try {
      const { error: securityError } = await supabase.rpc('exec_sql', {
        sql: "ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS security_settings JSONB DEFAULT '{}';"
      });
      if (securityError) console.log('خطأ في إضافة حقل security_settings:', securityError.message);
      else console.log('✓ تم إضافة حقل security_settings');
    } catch (e) {
      console.log('خطأ في إضافة حقل security_settings:', e.message);
    }
    
    // 2. تحديث الحساب الإداري
    console.log('2. تحديث الحساب الإداري...');
    const { error: updateError } = await supabase
      .from('admin_users')
      .update({
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
      .eq('email', 'info@worldtripagency.com');
    
    if (updateError) {
      console.log('خطأ في تحديث الحساب:', updateError.message);
    } else {
      console.log('✓ تم تحديث الحساب الإداري بنجاح');
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
      const admin = adminUsers[0];
      console.log('✓ تم العثور على الحساب الإداري:');
      console.log('  - الاسم:', admin.name);
      console.log('  - البريد الإلكتروني:', admin.email);
      console.log('  - الهاتف:', admin.phone);
      console.log('  - المنصب:', admin.position);
      console.log('  - القسم:', admin.department);
      console.log('  - تاريخ الميلاد:', admin.birth_date);
      console.log('  - التفضيلات:', admin.preferences);
      console.log('  - إعدادات الأمان:', admin.security_settings);
    }
    
    console.log('\n🎉 تم الانتهاء من تحديث قاعدة البيانات!');
    
  } catch (error) {
    console.error('❌ خطأ عام:', error.message);
  }
}

updateDatabaseStructure();
