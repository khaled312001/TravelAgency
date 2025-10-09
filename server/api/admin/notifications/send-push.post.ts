import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    const { title, message, type = 'message', data = {} } = body
    
    if (!title || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and message are required'
      })
    }

    // Create notification in database
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        title,
        message,
        type,
        data,
        is_read: false
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create notification'
      })
    }

    // Send push notification to all registered service workers
    try {
      // This would typically involve sending to a push service
      // For now, we'll simulate by storing the notification for real-time updates
      console.log('Push notification sent:', { title, message, type, data })
    } catch (pushError) {
      console.error('Push notification error:', pushError)
      // Don't fail the request if push fails
    }

    return {
      success: true,
      message: 'Notification sent successfully',
      data: notification
    }

  } catch (error: any) {
    console.error('Send push notification error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
