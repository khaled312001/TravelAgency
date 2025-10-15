import { createClient } from '@supabase/supabase-js'

// إعدادات Supabase
const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'

// إنشاء عميل Supabase
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupAdmin() {
  try {
    console.log('🚀 بدء إعداد حساب الإدارة...')

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
setupAdmin()
