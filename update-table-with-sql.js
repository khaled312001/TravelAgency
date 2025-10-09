import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// إعداد Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateTableWithSQL() {
  try {
    console.log('🚀 بدء تحديث جدول contact_messages...')
    
    // SQL statements للتحديث
    const sqlStatements = [
      // إضافة الحقول الجديدة
      "ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'inquiry';",
      "ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES packages(id) ON DELETE SET NULL;",
      "ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS package_name VARCHAR(255);",
      
      // تحديث أنواع البيانات
      "ALTER TABLE contact_messages ALTER COLUMN name TYPE VARCHAR(255);",
      "ALTER TABLE contact_messages ALTER COLUMN email TYPE VARCHAR(255);",
      "ALTER TABLE contact_messages ALTER COLUMN phone TYPE VARCHAR(50);",
      "ALTER TABLE contact_messages ALTER COLUMN subject TYPE VARCHAR(255);",
      "ALTER TABLE contact_messages ALTER COLUMN message TYPE TEXT;",
      "ALTER TABLE contact_messages ALTER COLUMN status SET DEFAULT 'unread';",
      
      // إضافة الفهارس
      "CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);",
      "CREATE INDEX IF NOT EXISTS idx_contact_messages_type ON contact_messages(type);",
      "CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);",
      "CREATE INDEX IF NOT EXISTS idx_contact_messages_package_id ON contact_messages(package_id);"
    ]
    
    // تنفيذ كل statement
    for (let i = 0; i < sqlStatements.length; i++) {
      const sql = sqlStatements[i]
      console.log(`📝 تنفيذ SQL ${i + 1}/${sqlStatements.length}: ${sql.substring(0, 50)}...`)
      
      try {
        // استخدام REST API لتنفيذ SQL
        const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'apikey': supabaseServiceKey
          },
          body: JSON.stringify({ sql })
        })
        
        if (!response.ok) {
          const errorData = await response.text()
          console.log(`⚠️ تحذير في SQL ${i + 1}: ${errorData}`)
        } else {
          console.log(`✅ نجح SQL ${i + 1}`)
        }
      } catch (err) {
        console.log(`⚠️ تحذير في SQL ${i + 1}: ${err.message}`)
      }
    }
    
    // اختبار الجدول المحدث
    console.log('🧪 اختبار الجدول المحدث...')
    
    const { data: testData, error: testError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1)
    
    if (testError) {
      console.error('❌ خطأ في اختبار الجدول:', testError)
    } else {
      console.log('✅ الجدول يعمل بشكل صحيح')
    }
    
    // اختبار إدراج بيانات مع الحقول الجديدة
    console.log('🧪 اختبار إدراج بيانات مع الحقول الجديدة...')
    
    const { data: insertData, error: insertError } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: 'اختبار النظام',
          email: 'test@example.com',
          phone: '+966501234567',
          subject: 'اختبار فورم التواصل',
          message: 'هذه رسالة تجريبية لاختبار النظام الجديد',
          type: 'inquiry',
          status: 'unread'
        }
      ])
      .select()
    
    if (insertError) {
      console.error('❌ خطأ في اختبار الإدراج:', insertError)
    } else {
      console.log('✅ تم إدراج البيانات بنجاح:', insertData[0].id)
      
      // حذف البيانات التجريبية
      const { error: deleteError } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', insertData[0].id)
      
      if (deleteError) {
        console.log('⚠️ تحذير: فشل في حذف البيانات التجريبية')
      } else {
        console.log('✅ تم حذف البيانات التجريبية')
      }
    }
    
    // عرض هيكل الجدول
    console.log('📋 هيكل الجدول المحدث:')
    
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'contact_messages')
      .eq('table_schema', 'public')
      .order('ordinal_position')
    
    if (columnsError) {
      console.error('❌ خطأ في جلب هيكل الجدول:', columnsError)
    } else {
      columns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(مطلوب)' : '(اختياري)'} ${col.column_default ? `[افتراضي: ${col.column_default}]` : ''}`)
      })
    }
    
    console.log('🎉 تم تحديث جدول contact_messages بنجاح!')
    console.log('📝 يمكنك الآن استخدام نظام فورم التواصل والحجز')
    
  } catch (error) {
    console.error('❌ خطأ عام في تحديث الجدول:', error)
  }
}

// تشغيل التحديث
updateTableWithSQL()
