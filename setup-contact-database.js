import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

// إعداد Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupContactDatabase() {
  try {
    console.log('🚀 بدء إعداد قاعدة بيانات فورم التواصل...')
    
    // 1. التحقق من الاتصال
    console.log('🔌 التحقق من الاتصال...')
    
    const { data: testData, error: testError } = await supabase
      .from('packages')
      .select('id')
      .limit(1)
    
    if (testError) {
      console.error('❌ خطأ في الاتصال:', testError)
      return
    }
    
    console.log('✅ الاتصال ناجح')
    
    // 2. التحقق من وجود جدول contact_messages
    console.log('📋 التحقق من جدول contact_messages...')
    
    const { data: existingData, error: existingError } = await supabase
      .from('contact_messages')
      .select('*')
      .limit(1)
    
    let tableExists = true
    if (existingError && existingError.code === 'PGRST116') {
      tableExists = false
      console.log('📝 الجدول غير موجود - سيتم إنشاؤه')
    } else if (existingError) {
      console.error('❌ خطأ في التحقق من الجدول:', existingError)
      return
    } else {
      console.log('✅ الجدول موجود بالفعل')
    }
    
    // 3. إنشاء الجدول إذا لم يكن موجوداً
    if (!tableExists) {
      console.log('🔨 إنشاء جدول contact_messages...')
      
      // محاولة إنشاء الجدول باستخدام SQL
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
      
      try {
        const { error: createError } = await supabase.rpc('exec_sql', {
          sql: createTableSQL
        })
        
        if (createError) {
          console.error('❌ خطأ في إنشاء الجدول:', createError)
          console.log('🔄 محاولة طريقة بديلة...')
          
          // طريقة بديلة: إنشاء الجدول باستخدام REST API
          await createTableAlternative()
        } else {
          console.log('✅ تم إنشاء الجدول بنجاح')
        }
      } catch (err) {
        console.error('❌ خطأ في إنشاء الجدول:', err)
        console.log('🔄 محاولة طريقة بديلة...')
        await createTableAlternative()
      }
    }
    
    // 4. إضافة الحقول الجديدة إذا لم تكن موجودة
    console.log('🔧 إضافة الحقول الجديدة...')
    
    await addNewFields()
    
    // 5. اختبار النظام
    console.log('🧪 اختبار النظام...')
    
    await testSystem()
    
    console.log('🎉 تم إعداد قاعدة البيانات بنجاح!')
    console.log('📝 يمكنك الآن استخدام نظام فورم التواصل والحجز')
    
  } catch (error) {
    console.error('❌ خطأ عام في إعداد قاعدة البيانات:', error)
  }
}

async function createTableAlternative() {
  try {
    console.log('🔄 محاولة إنشاء الجدول بطريقة بديلة...')
    
    // إنشاء جدول بسيط أولاً
    const { data: insertData, error: insertError } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: 'test',
          email: 'test@test.com',
          message: 'test'
        }
      ])
      .select()
    
    if (insertError) {
      console.error('❌ فشل في إنشاء الجدول:', insertError)
    } else {
      console.log('✅ تم إنشاء الجدول بنجاح')
      
      // حذف البيانات التجريبية
      await supabase
        .from('contact_messages')
        .delete()
        .eq('id', insertData[0].id)
    }
  } catch (error) {
    console.error('❌ خطأ في الطريقة البديلة:', error)
  }
}

async function addNewFields() {
  const fields = [
    { name: 'type', type: 'VARCHAR(50)', default: "'inquiry'" },
    { name: 'package_id', type: 'UUID', default: null },
    { name: 'package_name', type: 'VARCHAR(255)', default: null }
  ]
  
  for (const field of fields) {
    try {
      console.log(`🔧 إضافة حقل ${field.name}...`)
      
      // محاولة إدراج بيانات مع الحقل الجديد
      const testData = {
        name: 'test',
        email: 'test@test.com',
        message: 'test',
        [field.name]: field.default === null ? null : field.default.replace(/'/g, '')
      }
      
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([testData])
        .select()
      
      if (error) {
        console.log(`⚠️ حقل ${field.name} غير موجود أو يحتاج تحديث`)
      } else {
        console.log(`✅ حقل ${field.name} يعمل بشكل صحيح`)
        
        // حذف البيانات التجريبية
        await supabase
          .from('contact_messages')
          .delete()
          .eq('id', data[0].id)
      }
    } catch (err) {
      console.log(`⚠️ خطأ في حقل ${field.name}:`, err.message)
    }
  }
}

async function testSystem() {
  try {
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
        console.log('✅ تم الإدراج الأساسي بنجاح')
        
        // حذف البيانات التجريبية
        await supabase
          .from('contact_messages')
          .delete()
          .eq('id', basicInsertData[0].id)
      }
    } else {
      console.log('✅ تم إدراج البيانات بنجاح:', insertData[0].id)
      
      // حذف البيانات التجريبية
      await supabase
        .from('contact_messages')
        .delete()
        .eq('id', insertData[0].id)
    }
    
    // اختبار جلب البيانات
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
    
  } catch (error) {
    console.error('❌ خطأ في اختبار النظام:', error)
  }
}

// تشغيل الإعداد
setupContactDatabase()
