import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    console.log('Fetching notifications from database...')
    
    // Get query parameters
    const query = getQuery(event)
    const { status, type, search } = query

    // Build the query
    let supabaseQuery = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (status && typeof status === 'string') {
      if (status === 'unread') {
        supabaseQuery = supabaseQuery.eq('is_read', false)
      } else if (status === 'read') {
        supabaseQuery = supabaseQuery.eq('is_read', true)
      }
    }

    if (type && typeof type === 'string') {
      supabaseQuery = supabaseQuery.eq('type', type)
    }

    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase()
      supabaseQuery = supabaseQuery.or(`title.ilike.%${searchLower}%,message.ilike.%${searchLower}%`)
    }

    // Execute the query
    const { data: notifications, error } = await supabaseQuery

    if (error) {
      console.error('Database error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    console.log('Notifications fetched successfully:', notifications?.length || 0)

    // Transform data to match frontend expectations
    const transformedNotifications = (notifications || []).map(notification => ({
      id: notification.id,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      status: notification.is_read ? 'read' : 'unread',
      data: {},
      created_at: notification.created_at,
      updated_at: notification.created_at // notifications table doesn't have updated_at
    }))

    return {
      success: true,
      data: transformedNotifications
    }

  } catch (error: any) {
    console.error('Notifications fetch error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
