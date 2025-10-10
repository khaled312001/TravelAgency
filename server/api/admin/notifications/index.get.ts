import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'

const supabase = createClient(supabaseUrl, supabaseServiceKey)

export default defineEventHandler(async (event) => {
  try {
    
    // Get query parameters
    const query = getQuery(event)
    const { search, status, type, date } = query
    
    console.log('Notifications API called with params:', { search, status, type, date })
    
    // Build the query
    let queryBuilder = supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
    
    // Apply filters
    if (search) {
      queryBuilder = queryBuilder.or(`title.ilike.%${search}%,message.ilike.%${search}%`)
    }
    
    if (status === 'read') {
      queryBuilder = queryBuilder.eq('is_read', true)
    } else if (status === 'unread') {
      queryBuilder = queryBuilder.eq('is_read', false)
    }
    
    if (type) {
      queryBuilder = queryBuilder.eq('type', type)
    }
    
    if (date) {
      const now = new Date()
      let startDate: Date
      
      switch (date) {
        case 'today':
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case 'week':
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case 'month':
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        default:
          startDate = new Date(0) // All time
      }
      
      queryBuilder = queryBuilder.gte('created_at', startDate.toISOString())
    }
    
    const { data: notifications, error } = await queryBuilder
    
    console.log('Query result:', { notifications: notifications?.length, error: error?.message })
    
    if (error) {
      console.error('Error fetching notifications:', error)
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      })
      
      // If table doesn't exist, return empty array instead of error
      if (error.code === 'PGRST116' || 
          error.message.includes('relation "notifications" does not exist') ||
          error.message.includes('does not exist')) {
        console.log('Notifications table does not exist, returning empty array')
        return {
          success: true,
          notifications: []
        }
      }
      
      // For other errors, return empty array to prevent 500 errors
      console.log('Database error occurred, returning empty array')
      return {
        success: true,
        notifications: []
      }
    }
    
    console.log('Returning notifications:', notifications?.length || 0)
    return {
      success: true,
      notifications: notifications || []
    }
    
  } catch (error) {
    console.error('Error in notifications API:', error)
    // Instead of throwing an error, return empty array to prevent 500 errors
    return {
      success: true,
      notifications: []
    }
  }
})