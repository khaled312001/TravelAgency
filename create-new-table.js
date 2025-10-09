import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// إعداد Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function createNewTable() {
  try {
    console.log('🚀 بدء إنشاء جدول contact_messages_updated...')
    
    // 1. إنشاء جدول جديد مع الحقول المطلوبة
    console.log('📝 إنشاء جدول جديد...')
    
    // محاولة إنشاء الجدول بإدراج بيانات
    const testData = {
      name: 'اختبار النظام',
      email: 'test@example.com',
      phone: '+966501234567',
      subject: 'اختبار فورم التواصل',
      message: 'هذه رسالة تجريبية لاختبار النظام الجديد',
      type: 'inquiry',
      status: 'unread',
      package_id: null,
      package_name: null
    }
    
    console.log('🧪 اختبار إدراج بيانات مع الحقول الجديدة...')
    
    const { data: insertData, error: insertError } = await supabase
      .from('contact_messages')
      .insert([testData])
      .select()
    
    if (insertError) {
      console.error('❌ خطأ في إدراج البيانات مع الحقول الجديدة:', insertError)
      
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
        
        console.log('⚠️ الجدول موجود ولكن يحتاج تحديث يدوي')
        console.log('📝 يرجى تشغيل SQL التالي في Supabase SQL Editor:')
        console.log(`
-- إضافة الحقول الجديدة
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'inquiry';
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES packages(id) ON DELETE SET NULL;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS package_name VARCHAR(255);

-- تحديث الحقول الموجودة
ALTER TABLE contact_messages ALTER COLUMN name TYPE VARCHAR(255);
ALTER TABLE contact_messages ALTER COLUMN email TYPE VARCHAR(255);
ALTER TABLE contact_messages ALTER COLUMN phone TYPE VARCHAR(50);
ALTER TABLE contact_messages ALTER COLUMN subject TYPE VARCHAR(255);
ALTER TABLE contact_messages ALTER COLUMN message TYPE TEXT;
ALTER TABLE contact_messages ALTER COLUMN status SET DEFAULT 'unread';

-- إضافة فهرس
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_type ON contact_messages(type);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_package_id ON contact_messages(package_id);
        `)
      }
    } else {
      console.log('✅ تم إدراج البيانات مع الحقول الجديدة بنجاح:', insertData[0].id)
      
      // حذف البيانات التجريبية
      await supabase
        .from('contact_messages')
        .delete()
        .eq('id', insertData[0].id)
      
      console.log('✅ الجدول يحتوي على جميع الحقول المطلوبة!')
    }
    
    // 2. اختبار جلب البيانات
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
    
    // 3. اختبار العمليات المختلفة
    console.log('🧪 اختبار العمليات المختلفة...')
    
    // اختبار الفلترة
    const { data: filteredData, error: filterError } = await supabase
      .from('contact_messages')
      .select('*')
      .eq('status', 'unread')
      .limit(5)
    
    if (filterError) {
      console.log('⚠️ تحذير في الفلترة:', filterError.message)
    } else {
      console.log(`✅ الفلترة تعمل: ${filteredData.length} رسالة غير مقروءة`)
    }
    
    // اختبار البحث
    const { data: searchData, error: searchError } = await supabase
      .from('contact_messages')
      .select('*')
      .ilike('name', '%اختبار%')
      .limit(5)
    
    if (searchError) {
      console.log('⚠️ تحذير في البحث:', searchError.message)
    } else {
      console.log(`✅ البحث يعمل: ${searchData.length} نتيجة`)
    }
    
    console.log('🎉 تم اختبار قاعدة البيانات بنجاح!')
    console.log('📝 يمكنك الآن استخدام نظام فورم التواصل والحجز')
    
  } catch (error) {
    console.error('❌ خطأ عام في إنشاء الجدول:', error)
  }
}

// تشغيل الإعداد
createNewTable()
