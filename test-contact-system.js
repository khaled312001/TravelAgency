// اختبار نظام التواصل
// قم بتشغيل هذا الملف للتأكد من أن نظام التواصل يعمل بشكل صحيح

const testContactSystem = async () => {
  console.log('🧪 بدء اختبار نظام التواصل...')
  
  try {
    // 1. اختبار إرسال رسالة جديدة
    console.log('📤 اختبار إرسال رسالة جديدة...')
    
    const testMessage = {
      name: 'أحمد محمد - اختبار',
      email: 'test@example.com',
      phone: '+966501234567',
      subject: 'رسالة اختبار من النظام',
      message: 'هذه رسالة اختبار للتأكد من أن نظام التواصل يعمل بشكل صحيح.',
      type: 'inquiry'
    }
    
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testMessage)
    })
    
    const result = await response.json()
    
    if (result.success) {
      console.log('✅ تم إرسال الرسالة بنجاح:', result.data.id)
    } else {
      console.error('❌ فشل في إرسال الرسالة:', result)
      return
    }
    
    // 2. اختبار جلب الرسائل من الإدارة
    console.log('📥 اختبار جلب الرسائل من الإدارة...')
    
    const messagesResponse = await fetch('/api/admin/contact-messages')
    const messagesResult = await messagesResponse.json()
    
    if (messagesResult.success) {
      console.log('✅ تم جلب الرسائل بنجاح:', messagesResult.data.length, 'رسالة')
      
      // البحث عن الرسالة التي أرسلناها
      const ourMessage = messagesResult.data.find(msg => 
        msg.name === testMessage.name && 
        msg.email === testMessage.email
      )
      
      if (ourMessage) {
        console.log('✅ تم العثور على رسالتنا في قاعدة البيانات:', ourMessage.id)
        console.log('📊 تفاصيل الرسالة:', {
          id: ourMessage.id,
          name: ourMessage.name,
          email: ourMessage.email,
          subject: ourMessage.subject,
          status: ourMessage.status,
          type: ourMessage.type,
          created_at: ourMessage.created_at
        })
      } else {
        console.log('⚠️ لم يتم العثور على رسالتنا في قاعدة البيانات')
      }
    } else {
      console.error('❌ فشل في جلب الرسائل:', messagesResult)
    }
    
    console.log('🎉 انتهى اختبار نظام التواصل بنجاح!')
    
  } catch (error) {
    console.error('❌ خطأ في اختبار نظام التواصل:', error)
  }
}

// تشغيل الاختبار
testContactSystem()
