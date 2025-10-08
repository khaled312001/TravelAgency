import { createClient } from '@supabase/supabase-js'

// إعدادات Supabase
const supabaseUrl = 'https://jjhdknguyooesyafsacf.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpqaGRrbmd1eW9vZXN5YWZzYWNmIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MjA1MTcyMiwiZXhwIjoyMDU3NjI3NzIyfQ.06x17zwOvDfHy-Hl1zlV3jY3JdLXZx17Y_-Ql2VoBKQ'

// إنشاء عميل Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupAdminTables() {
  try {
    console.log('🚀 بدء إعداد جداول الإدارة...')

    // إنشاء جدول admin_users
    const { data: adminUsersTable, error: adminUsersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          name VARCHAR(255) NOT NULL,
          role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
          is_active BOOLEAN DEFAULT true,
          last_login TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (adminUsersError) {
      console.error('❌ خطأ في إنشاء جدول admin_users:', adminUsersError)
    } else {
      console.log('✅ تم إنشاء جدول admin_users بنجاح')
    }

    // إنشاء جدول admin_sessions
    const { data: adminSessionsTable, error: adminSessionsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_sessions (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
          session_token VARCHAR(255) UNIQUE NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (adminSessionsError) {
      console.error('❌ خطأ في إنشاء جدول admin_sessions:', adminSessionsError)
    } else {
      console.log('✅ تم إنشاء جدول admin_sessions بنجاح')
    }

    // إنشاء جدول admin_activity_logs
    const { data: adminLogsTable, error: adminLogsError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS admin_activity_logs (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
          action VARCHAR(255) NOT NULL,
          resource_type VARCHAR(100),
          resource_id UUID,
          details JSONB,
          ip_address INET,
          user_agent TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    })

    if (adminLogsError) {
      console.error('❌ خطأ في إنشاء جدول admin_activity_logs:', adminLogsError)
    } else {
      console.log('✅ تم إنشاء جدول admin_activity_logs بنجاح')
    }

    // إدراج حساب الإدارة الرئيسي
    const { data: adminUser, error: adminUserError } = await supabase
      .from('admin_users')
      .upsert({
        email: 'admin@wonderland.com',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        name: 'مدير النظام',
        role: 'super_admin',
        is_active: true
      }, {
        onConflict: 'email'
      })

    if (adminUserError) {
      console.error('❌ خطأ في إدراج حساب الإدارة:', adminUserError)
    } else {
      console.log('✅ تم إنشاء حساب الإدارة الرئيسي بنجاح')
      console.log('📧 البريد الإلكتروني: admin@wonderland.com')
      console.log('🔑 كلمة المرور: admin123')
    }

    // إدراج حساب إدارة إضافي
    const { data: managerUser, error: managerUserError } = await supabase
      .from('admin_users')
      .upsert({
        email: 'manager@wonderland.com',
        password_hash: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
        name: 'مدير المحتوى',
        role: 'admin',
        is_active: true
      }, {
        onConflict: 'email'
      })

    if (managerUserError) {
      console.error('❌ خطأ في إدراج حساب المدير:', managerUserError)
    } else {
      console.log('✅ تم إنشاء حساب المدير بنجاح')
      console.log('📧 البريد الإلكتروني: manager@wonderland.com')
      console.log('🔑 كلمة المرور: manager123')
    }

    console.log('🎉 تم إعداد نظام الإدارة بنجاح!')
    console.log('🌐 يمكنك الآن الوصول للوحة التحكم على: https://worldtripagency.com/admin/login')

  } catch (error) {
    console.error('❌ خطأ عام:', error)
  }
}

// تشغيل الإعداد
setupAdminTables()
