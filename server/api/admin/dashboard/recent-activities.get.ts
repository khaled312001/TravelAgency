import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    // Get recent bookings
    const { data: recentBookings } = await supabase
      .from('bookings')
      .select(`
        id,
        status,
        created_at,
        packages:package_id (title_ar, title_en)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    // Get recent contact messages
    const { data: recentMessages } = await supabase
      .from('contact_messages')
      .select('id, name, subject, created_at')
      .order('created_at', { ascending: false })
      .limit(3)

    const activities = []

    // Add booking activities
    if (recentBookings) {
      recentBookings.forEach(booking => {
        const packageTitle = booking.packages?.title_ar || booking.packages?.title_en || 'باقة غير محددة'
        activities.push({
          id: `booking-${booking.id}`,
          action: 'new_booking',
          description: `حجز جديد: ${packageTitle}`,
          timestamp: booking.created_at,
          type: 'booking' as const
        })
      })
    }

    // Add message activities
    if (recentMessages) {
      recentMessages.forEach(message => {
        activities.push({
          id: `message-${message.id}`,
          action: 'new_message',
          description: `رسالة جديدة من ${message.name}: ${message.subject}`,
          timestamp: message.created_at,
          type: 'message' as const
        })
      })
    }

    // Sort by timestamp and limit to 5
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    return activities.slice(0, 5)
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch recent activities'
    })
  }
})
