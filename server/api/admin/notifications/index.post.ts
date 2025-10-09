import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate required fields
    if (!body.title || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and message are required'
      })
    }

    console.log('Creating new notification:', body.title)

    // Create notification
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        title: body.title,
        message: body.message,
        type: body.type || 'info',
        is_read: false
      })
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    console.log('Notification created successfully:', notification.id)

    return {
      success: true,
      data: {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        status: 'unread',
        data: {},
        created_at: notification.created_at,
        updated_at: notification.created_at
      }
    }

  } catch (error: any) {
    console.error('Notification creation error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
