import { createClient } from '@supabase/supabase-js'
import type { RecentActivity } from '~/types/admin'

export default defineEventHandler(async (event): Promise<RecentActivity[]> => {
  try {
    // Verify admin authentication
    await verifyAdminAuth(event)
    
    // Create Supabase client with service role key
    const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get recent activities from activity logs
    const { data: activities, error } = await supabase
      .from('admin_activity_logs')
      .select('action, created_at, details')
      .order('created_at', { ascending: false })
      .limit(10)

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch activities'
      })
    }

    // Transform activities to recent activities format
    const recentActivities: RecentActivity[] = activities?.map(activity => ({
      id: activity.created_at, // Use timestamp as ID for now
      action: activity.action,
      description: getActivityDescription(activity.action, activity.details),
      timestamp: activity.created_at,
      type: getActivityType(activity.action)
    })) || []

    // If no activities, return mock data
    if (recentActivities.length === 0) {
      return [
        {
          id: '1',
          action: 'create_package',
          description: 'تم إنشاء حزمة جديدة',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          type: 'package'
        },
        {
          id: '2',
          action: 'new_message',
          description: 'رسالة جديدة من العميل',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
          type: 'message'
        }
      ]
    }

    return recentActivities
  } catch (error: any) {
    console.error('Recent activities error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

// Helper function to get activity description
function getActivityDescription(action: string, details: any): string {
  const descriptions: Record<string, string> = {
    'login': 'تم تسجيل الدخول',
    'logout': 'تم تسجيل الخروج',
    'create_package': 'تم إنشاء حزمة جديدة',
    'update_package': 'تم تحديث حزمة',
    'delete_package': 'تم حذف حزمة',
    'create_destination': 'تم إنشاء وجهة جديدة',
    'update_destination': 'تم تحديث وجهة',
    'delete_destination': 'تم حذف وجهة',
    'new_booking': 'حجز جديد',
    'update_booking': 'تم تحديث حجز',
    'new_message': 'رسالة جديدة من العميل',
    'reply_message': 'تم الرد على رسالة'
  }

  return descriptions[action] || `نشاط: ${action}`
}

// Helper function to get activity type
function getActivityType(action: string): 'package' | 'booking' | 'message' | 'destination' {
  if (action.includes('package')) return 'package'
  if (action.includes('booking')) return 'booking'
  if (action.includes('message')) return 'message'
  if (action.includes('destination')) return 'destination'
  return 'message' // default
}

// Helper function to verify admin authentication
async function verifyAdminAuth(event: any) {
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'No valid session token provided'
    })
  }

  const sessionToken = authHeader.substring(7)
  
  // Create Supabase client with service role key
  const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
  const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'
  const supabase = createClient(supabaseUrl, supabaseServiceKey)

  const { data: session, error } = await supabase
    .from('admin_sessions')
    .select('expires_at')
    .eq('session_token', sessionToken)
    .single()

  if (error || !session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid session'
    })
  }

  // Check if session is expired
  const now = new Date()
  const expiresAt = new Date(session.expires_at)
  if (now > expiresAt) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Session expired'
    })
  }
}
