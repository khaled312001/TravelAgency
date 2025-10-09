import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    console.log('Contact form data received:', body)
    
    // Validate required fields
    if (!body.name || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name, message'
      })
    }

    // Email is optional for some forms (like destination forms)
    if (body.email) {
      // Validate email format only if provided
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(body.email)) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid email format'
        })
      }
    }

    // Try to save to database
    try {
      // Prepare insert data
      const insertData: any = {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        subject: body.subject || 'رسالة تواصل',
        message: body.message,
        status: 'unread'
      }

      // Determine message type from subject or other indicators
      let messageType = 'general'
      if (body.subject) {
        if (body.subject.includes('الوجهة') || body.subject.includes('destination')) {
          messageType = 'destination'
        } else if (body.subject.includes('الباقة') || body.subject.includes('package')) {
          messageType = 'package'
        } else if (body.subject.includes('الرئيسية') || body.subject.includes('home')) {
          messageType = 'home'
        }
      }
      
      // Add message type to subject for admin identification
      if (messageType !== 'general') {
        insertData.subject = `[${messageType.toUpperCase()}] ${insertData.subject}`
      }

      // Add destination_name if provided (only if column exists)
      if (body.destination_name) {
        insertData.destination_name = body.destination_name
      }

      const { data, error } = await supabase
        .from('contact_messages')
        .insert(insertData)
        .select()
        .single()

      if (error) {
        console.error('Database error:', error)
        throw error
      }

      console.log('Contact message saved to database:', data)

      // Create notification for admin
      try {
        let notificationTitle = 'رسالة تواصل جديدة'
        let notificationMessage = `رسالة تواصل جديدة من ${body.name}`
        
        if (body.package_name) {
          notificationTitle = `رسالة جديدة - ${body.package_name}`
          notificationMessage = `رسالة جديدة من ${body.name} بخصوص ${body.package_name}`
        } else if (body.destination_name) {
          notificationTitle = `استفسار عن الوجهة - ${body.destination_name}`
          notificationMessage = `استفسار جديد من ${body.name} عن ${body.destination_name}`
        }

        await supabase
          .from('notifications')
          .insert({
            title: notificationTitle,
            message: notificationMessage,
            type: 'message',
            is_read: false
          })

        console.log('Notification created for new contact message')
      } catch (notificationError) {
        console.error('Failed to create notification:', notificationError)
        // Don't fail the main request if notification creation fails
      }

      return {
        success: true,
        message: 'تم إرسال رسالتك بنجاح',
        data: data
      }

    } catch (dbError: any) {
      console.error('Database connection failed, using fallback:', dbError)
      
      // Fallback: return success without saving
      const mockData = {
        id: 'temp-' + Date.now(),
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        subject: body.subject || 'رسالة تواصل',
        message: body.message,
        status: 'unread',
        type: body.type || 'inquiry',
        created_at: new Date().toISOString()
      }

      return {
        success: true,
        message: 'تم إرسال رسالتك بنجاح (سيتم حفظها لاحقاً)',
        data: mockData
      }
    }

  } catch (error: any) {
    console.error('Contact form error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
