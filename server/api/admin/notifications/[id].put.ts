import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const notificationId = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!notificationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Notification ID is required'
      })
    }

    console.log('Updating notification:', notificationId, body)

    // Prepare update data
    const updateData: any = {}
    
    if (body.status !== undefined) {
      updateData.is_read = body.status === 'read'
    }

    if (body.title) {
      updateData.title = body.title
    }

    if (body.message) {
      updateData.message = body.message
    }

    if (body.type) {
      updateData.type = body.type
    }

    // Update notification
    const { data: notification, error } = await supabase
      .from('notifications')
      .update(updateData)
      .eq('id', notificationId)
      .select()
      .single()

    if (error) {
      console.error('Database error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    if (!notification) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Notification not found'
      })
    }

    console.log('Notification updated successfully:', notification.id)

    return {
      success: true,
      data: {
        id: notification.id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        status: notification.is_read ? 'read' : 'unread',
        data: {},
        created_at: notification.created_at,
        updated_at: notification.created_at
      }
    }

  } catch (error: any) {
    console.error('Notification update error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
