import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    const { title, message, type = 'info', data } = body
    
    if (!title || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and message are required'
      })
    }
    
    console.log('Creating notification:', { title, message, type })
    
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        title,
        message,
        type,
        data: data || null,
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
      notification,
      message: 'Notification created successfully'
    }
    
  } catch (error: any) {
    console.error('Error in create notification API:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})