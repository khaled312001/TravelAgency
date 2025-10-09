const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// إعداد Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateDatabase() {
  try {
    console.log('🚀 بدء تحديث قاعدة البيانات...')
    
    // 1. التحقق من وجود جدول contact_messages
    console.log('📋 التحقق من وجود جدول contact_messages...')
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'contact_messages')
    
    if (tablesError) {
      console.error('❌ خطأ في التحقق من الجداول:', tablesError)
      return
    }
    
    if (!tables || tables.length === 0) {
      console.log('📝 إنشاء جدول contact_messages...')
      
      // إنشاء الجدول إذا لم يكن موجوداً
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS contact_messages (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(50),
            subject VARCHAR(255),
            message TEXT NOT NULL,
            status VARCHAR(50) DEFAULT 'unread',
            type VARCHAR(50) DEFAULT 'inquiry',
            package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
            package_name VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `
      })
      
      if (createError) {
        console.error('❌ خطأ في إنشاء الجدول:', createError)
        return
      }
      
      console.log('✅ تم إنشاء جدول contact_messages بنجاح')
    } else {
      console.log('✅ جدول contact_messages موجود بالفعل')
    }
    
    // 2. إضافة الحقول الجديدة
    console.log('🔧 إضافة الحقول الجديدة...')
    
    const addColumnsSQL = `
      DO $$ 
      BEGIN
        -- إضافة حقل type إذا لم يكن موجوداً
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'contact_messages' AND column_name = 'type') THEN
          ALTER TABLE contact_messages ADD COLUMN type VARCHAR(50) DEFAULT 'inquiry';
        END IF;
        
        -- إضافة حقل package_id إذا لم يكن موجوداً
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'contact_messages' AND column_name = 'package_id') THEN
          ALTER TABLE contact_messages ADD COLUMN package_id UUID REFERENCES packages(id) ON DELETE SET NULL;
        END IF;
        
        -- إضافة حقل package_name إذا لم يكن موجوداً
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'contact_messages' AND column_name = 'package_name') THEN
          ALTER TABLE contact_messages ADD COLUMN package_name VARCHAR(255);
        END IF;
      END $$;
    `
    
    const { error: addColumnsError } = await supabase.rpc('exec_sql', {
      sql: addColumnsSQL
    })
    
    if (addColumnsError) {
      console.error('❌ خطأ في إضافة الحقول:', addColumnsError)
      return
    }
    
    console.log('✅ تم إضافة الحقول الجديدة بنجاح')
    
    // 3. تحديث أنواع البيانات
    console.log('🔄 تحديث أنواع البيانات...')
    
    const updateTypesSQL = `
      DO $$ 
      BEGIN
        -- تحديث نوع حقل name
        ALTER TABLE contact_messages ALTER COLUMN name TYPE VARCHAR(255);
        
        -- تحديث نوع حقل email
        ALTER TABLE contact_messages ALTER COLUMN email TYPE VARCHAR(255);
        
        -- تحديث نوع حقل phone
        ALTER TABLE contact_messages ALTER COLUMN phone TYPE VARCHAR(50);
        
        -- تحديث نوع حقل subject
        ALTER TABLE contact_messages ALTER COLUMN subject TYPE VARCHAR(255);
        
        -- تحديث نوع حقل message
        ALTER TABLE contact_messages ALTER COLUMN message TYPE TEXT;
        
        -- تحديث القيمة الافتراضية لحقل status
        ALTER TABLE contact_messages ALTER COLUMN status SET DEFAULT 'unread';
      END $$;
    `
    
    const { error: updateTypesError } = await supabase.rpc('exec_sql', {
      sql: updateTypesSQL
    })
    
    if (updateTypesError) {
      console.error('❌ خطأ في تحديث أنواع البيانات:', updateTypesError)
      return
    }
    
    console.log('✅ تم تحديث أنواع البيانات بنجاح')
    
    // 4. إضافة الفهارس
    console.log('📊 إضافة الفهارس...')
    
    const indexesSQL = `
      CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
      CREATE INDEX IF NOT EXISTS idx_contact_messages_type ON contact_messages(type);
      CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
      CREATE INDEX IF NOT EXISTS idx_contact_messages_package_id ON contact_messages(package_id);
    `
    
    const { error: indexesError } = await supabase.rpc('exec_sql', {
      sql: indexesSQL
    })
    
    if (indexesError) {
      console.error('❌ خطأ في إضافة الفهارس:', indexesError)
      return
    }
    
    console.log('✅ تم إضافة الفهارس بنجاح')
    
    // 5. التحقق من النتيجة النهائية
    console.log('🔍 التحقق من النتيجة النهائية...')
    
    const { data: columns, error: columnsError } = await supabase
      .from('information_schema.columns')
      .select('column_name, data_type, is_nullable, column_default')
      .eq('table_name', 'contact_messages')
      .eq('table_schema', 'public')
      .order('ordinal_position')
    
    if (columnsError) {
      console.error('❌ خطأ في التحقق من الأعمدة:', columnsError)
      return
    }
    
    console.log('📋 أعمدة جدول contact_messages:')
    columns.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(مطلوب)' : '(اختياري)'} ${col.column_default ? `[افتراضي: ${col.column_default}]` : ''}`)
    })
    
    // 6. اختبار إدراج بيانات تجريبية
    console.log('🧪 اختبار إدراج بيانات تجريبية...')
    
    const { data: testData, error: testError } = await supabase
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
    
    if (testError) {
      console.error('❌ خطأ في اختبار الإدراج:', testError)
      return
    }
    
    console.log('✅ تم إدراج البيانات التجريبية بنجاح:', testData[0].id)
    
    // 7. حذف البيانات التجريبية
    const { error: deleteError } = await supabase
      .from('contact_messages')
      .delete()
      .eq('id', testData[0].id)
    
    if (deleteError) {
      console.error('⚠️ تحذير: فشل في حذف البيانات التجريبية:', deleteError)
    } else {
      console.log('✅ تم حذف البيانات التجريبية')
    }
    
    console.log('🎉 تم تحديث قاعدة البيانات بنجاح!')
    console.log('📝 يمكنك الآن استخدام نظام فورم التواصل والحجز')
    
  } catch (error) {
    console.error('❌ خطأ عام في تحديث قاعدة البيانات:', error)
  }
}

// تشغيل التحديث
updateDatabase()
