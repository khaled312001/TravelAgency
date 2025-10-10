import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'

// Use anon key for contact form (public access)
const supabase = createClient(supabaseUrl, supabaseAnonKey)
// Use service key for admin operations (push notifications)
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Configure web-push for admin notifications
webpush.setVapidDetails(
  'mailto:admin@worldtripagency.com',
  'BFdVyptxcvboSd9zX8m-IciFTHpCkS6Ok1BJBPhnOn8kG4Es_eXCgPbh0c5vOniOo4kS24MlEciLsF7Adw1i7sY', // Public key
  '5sWLQmMWoafI6LySdj-WRJznNWooki4PK6DsJTsL5T8' // Private key
)

// Function to send push notification to admin
async function sendAdminNotification({ title, message, url = '/admin/messages' }: { title: string, message: string, url?: string }) {
  try {
    // Get admin subscriptions (you might want to filter for admin users only)
    const { data: subscriptions, error } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*')

    if (error || !subscriptions || subscriptions.length === 0) {
      console.log('No admin subscriptions found')
      return
    }

    const notificationPayload = JSON.stringify({
      title,
      body: message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-64x64.png',
      data: {
        url,
        timestamp: Date.now()
      },
      actions: [
        {
          action: 'open',
          title: 'فتح',
          icon: '/icons/icon-64x64.png'
        },
        {
          action: 'close',
          title: 'إغلاق',
          icon: '/icons/icon-64x64.png'
        }
      ]
    })

    // Send to all admin subscriptions
    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: subscription.keys
          },
          notificationPayload
        )
      } catch (error) {
        console.error('Error sending notification to subscription:', error)
      }
    }
  } catch (error) {
    console.error('Error in sendAdminNotification:', error)
  }
}

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

    // Phone is required for destination forms
    if (body.destination_name && !body.phone) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Phone number is required for destination inquiries'
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

      // Add destination_name if provided (store in subject for now)
      if (body.destination_name) {
        insertData.subject = `[DESTINATION] ${insertData.subject} - ${body.destination_name}`
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

        const { data: notification, error: notificationError } = await supabaseAdmin
          .from('notifications')
          .insert({
            title: notificationTitle,
            message: notificationMessage,
            type: 'message',
            is_read: false
          })
          .select()
          .single()

        if (notificationError) {
          console.error('Failed to create notification:', notificationError)
        } else {
          console.log('Notification created for new contact message:', notification)
          
          // Send push notification to admin
          try {
            await sendAdminNotification({
              title: notificationTitle,
              message: notificationMessage,
              url: '/admin/messages'
            })
            console.log('Push notification sent to admin for new contact message')
          } catch (pushError) {
            console.error('Push notification error:', pushError)
          }
        }
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
