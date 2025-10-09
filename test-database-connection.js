import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// إعداد Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function testConnection() {
  try {
    console.log('🔌 اختبار الاتصال بقاعدة البيانات...')
    console.log('📍 URL:', supabaseUrl)
    console.log('🔑 Service Key:', supabaseServiceKey.substring(0, 20) + '...')
    
    // اختبار الاتصال الأساسي
    console.log('📋 اختبار الاتصال...')
    
    const { data, error } = await supabase
      .from('packages')
      .select('id, title_en')
      .limit(1)
    
    if (error) {
      console.error('❌ خطأ في الاتصال:', error)
      return false
    }
    
    console.log('✅ الاتصال ناجح!')
    console.log('📦 البيانات المسترجعة:', data)
    
    // اختبار جدول contact_messages
    console.log('📧 اختبار جدول contact_messages...')
    
    const { data: contactData, error: contactError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1)
    
    if (contactError) {
      if (contactError.code === 'PGRST116') {
        console.log('📝 جدول contact_messages غير موجود - سيتم إنشاؤه')
        return 'create_table'
      } else {
        console.error('❌ خطأ في جدول contact_messages:', contactError)
        return false
      }
    }
    
    console.log('✅ جدول contact_messages موجود')
    console.log('📊 البيانات:', contactData)
    
    return true
    
  } catch (error) {
    console.error('❌ خطأ عام:', error)
    return false
  }
}

// تشغيل الاختبار
testConnection().then(result => {
  if (result === true) {
    console.log('🎉 كل شيء يعمل بشكل صحيح!')
  } else if (result === 'create_table') {
    console.log('📝 يحتاج إلى إنشاء الجدول')
  } else {
    console.log('❌ هناك مشاكل تحتاج إلى حل')
  }
})
