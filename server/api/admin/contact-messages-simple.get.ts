export default defineEventHandler(async (event) => {
  try {
    console.log('Fetching contact messages...')
    
    // Return mock data for now
    const mockMessages = [
      {
        id: '1',
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+966501234567',
        subject: 'استفسار عن رحلة باريس',
        message: 'أرغب في معرفة تفاصيل رحلة باريس الرومانسية',
        status: 'unread',
        type: 'inquiry',
        created_at: '2025-01-09T10:00:00Z'
      },
      {
        id: '2',
        name: 'فاطمة علي',
        email: 'fatima@example.com',
        phone: '+966502345678',
        subject: 'شكوى في الخدمة',
        message: 'واجهت مشكلة في حجز الفندق',
        status: 'unread',
        type: 'complaint',
        created_at: '2025-01-09T09:30:00Z'
      },
      {
        id: '3',
        name: 'محمد السعد',
        email: 'mohammed@example.com',
        phone: '+966503456789',
        subject: 'اقتراح تحسين',
        message: 'أقترح إضافة المزيد من الوجهات الآسيوية',
        status: 'read',
        type: 'suggestion',
        created_at: '2025-01-09T08:15:00Z'
      },
      {
        id: '4',
        name: 'نورا أحمد',
        email: 'nora@example.com',
        phone: '+966504567890',
        subject: 'حجز رحلة تايلاند',
        message: 'أريد حجز رحلة تايلاند لشخصين',
        status: 'unread',
        type: 'booking',
        created_at: '2025-01-09T07:45:00Z'
      }
    ]

    console.log('Contact messages fetched successfully:', mockMessages.length)

    return {
      success: true,
      data: mockMessages
    }

  } catch (error: any) {
    console.error('Contact messages fetch error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
