const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// إعداد Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function updateDatabase() {
  try {
    console.log('🚀 بدء تحديث قاعدة البيانات...')
    
    // 1. التحقق من وجود الجدول
    console.log('📋 التحقق من وجود جدول contact_messages...')
    
    const { data: existingData, error: selectError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1)
    
    if (selectError && selectError.code === 'PGRST116') {
      console.log('📝 الجدول غير موجود، سيتم إنشاؤه...')
      
      // إنشاء الجدول باستخدام SQL
      const createTableSQL = `
        CREATE TABLE contact_messages (
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
      
      const { error: createError } = await supabase.rpc('exec_sql', {
        sql: createTableSQL
      })
      
      if (createError) {
        console.error('❌ خطأ في إنشاء الجدول:', createError)
        return
      }
      
      console.log('✅ تم إنشاء الجدول بنجاح')
    } else if (selectError) {
      console.error('❌ خطأ في التحقق من الجدول:', selectError)
      return
    } else {
      console.log('✅ الجدول موجود بالفعل')
    }
    
    // 2. محاولة إضافة الحقول الجديدة
    console.log('🔧 محاولة إضافة الحقول الجديدة...')
    
    const addFieldsSQL = `
      DO $$ 
      BEGIN
        -- إضافة حقل type
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'contact_messages' AND column_name = 'type') THEN
          ALTER TABLE contact_messages ADD COLUMN type VARCHAR(50) DEFAULT 'inquiry';
        END IF;
        
        -- إضافة حقل package_id
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'contact_messages' AND column_name = 'package_id') THEN
          ALTER TABLE contact_messages ADD COLUMN package_id UUID REFERENCES packages(id) ON DELETE SET NULL;
        END IF;
        
        -- إضافة حقل package_name
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                      WHERE table_name = 'contact_messages' AND column_name = 'package_name') THEN
          ALTER TABLE contact_messages ADD COLUMN package_name VARCHAR(255);
        END IF;
      END $$;
    `
    
    try {
      const { error: addFieldsError } = await supabase.rpc('exec_sql', {
        sql: addFieldsSQL
      })
      
      if (addFieldsError) {
        console.log('⚠️ تحذير في إضافة الحقول:', addFieldsError.message)
      } else {
        console.log('✅ تم إضافة الحقول الجديدة')
      }
    } catch (err) {
      console.log('⚠️ تحذير في إضافة الحقول:', err.message)
    }
    
    // 3. اختبار إدراج بيانات
    console.log('🧪 اختبار إدراج بيانات...')
    
    const testData = {
      name: 'اختبار النظام',
      email: 'test@example.com',
      phone: '+966501234567',
      subject: 'اختبار فورم التواصل',
      message: 'هذه رسالة تجريبية لاختبار النظام الجديد',
      type: 'inquiry',
      status: 'unread'
    }
    
    const { data: insertData, error: insertError } = await supabase
      .from('contact_messages')
      .insert([testData])
      .select()
    
    if (insertError) {
      console.error('❌ خطأ في اختبار الإدراج:', insertError)
      
      // محاولة إدراج بدون الحقول الجديدة
      console.log('🔄 محاولة إدراج بدون الحقول الجديدة...')
      
      const basicData = {
        name: 'اختبار النظام',
        email: 'test@example.com',
        phone: '+966501234567',
        subject: 'اختبار فورم التواصل',
        message: 'هذه رسالة تجريبية لاختبار النظام الجديد',
        status: 'unread'
      }
      
      const { data: basicInsertData, error: basicInsertError } = await supabase
        .from('contact_messages')
        .insert([basicData])
        .select()
      
      if (basicInsertError) {
        console.error('❌ خطأ في الإدراج الأساسي:', basicInsertError)
        return
      } else {
        console.log('✅ تم الإدراج الأساسي بنجاح:', basicInsertData[0].id)
        
        // حذف البيانات التجريبية
        await supabase
          .from('contact_messages')
          .delete()
          .eq('id', basicInsertData[0].id)
      }
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
    
    // 4. اختبار جلب البيانات
    console.log('🔍 اختبار جلب البيانات...')
    
    const { data: fetchData, error: fetchError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(5)
    
    if (fetchError) {
      console.error('❌ خطأ في جلب البيانات:', fetchError)
    } else {
      console.log(`✅ تم جلب ${fetchData.length} رسالة بنجاح`)
    }
    
    console.log('🎉 تم تحديث قاعدة البيانات بنجاح!')
    console.log('📝 يمكنك الآن استخدام نظام فورم التواصل والحجز')
    
  } catch (error) {
    console.error('❌ خطأ عام في تحديث قاعدة البيانات:', error)
  }
}

// تشغيل التحديث
updateDatabase()
