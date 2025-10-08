import { createClient } from '@supabase/supabase-js'
import type { DashboardStats } from '~/types/admin'

export default defineEventHandler(async (event): Promise<DashboardStats> => {
  try {
    // Verify admin authentication
    await verifyAdminAuth(event)
    
    // Create Supabase client with service role key
    const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all statistics in parallel
    const [
      usersResult,
      messagesResult,
      destinationsResult,
      packagesResult,
      bookingsResult,
      pendingBookingsResult,
      confirmedBookingsResult,
      cancelledBookingsResult,
      completedBookingsResult
    ] = await Promise.all([
      // Total users (from package_inquiries and destination_inquiries)
      supabase
        .from('package_inquiries')
        .select('id', { count: 'exact', head: true }),
      
      // New messages (unread inquiries from last 7 days)
      supabase
        .from('package_inquiries')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      
      // Total destinations
      supabase
        .from('destinations')
        .select('id', { count: 'exact', head: true }),
      
      // Total packages
      supabase
        .from('packages')
        .select('id', { count: 'exact', head: true }),
      
      // Total bookings
      supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true }),
      
      // Pending bookings
      supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'pending'),
      
      // Confirmed bookings
      supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'confirmed'),
      
      // Cancelled bookings
      supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'cancelled'),
      
      // Completed bookings
      supabase
        .from('bookings')
        .select('id', { count: 'exact', head: true })
        .eq('status', 'completed')
    ])

    // Get destination inquiries count for new messages
    const destinationMessagesResult = await supabase
      .from('destination_inquiries')
      .select('id', { count: 'exact', head: true })
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

    const totalNewMessages = (messagesResult.count || 0) + (destinationMessagesResult.count || 0)

    return {
      totalUsers: usersResult.count || 0,
      newMessages: totalNewMessages,
      totalDestinations: destinationsResult.count || 0,
      totalPackages: packagesResult.count || 0,
      totalBookings: bookingsResult.count || 0,
      pendingBookings: pendingBookingsResult.count || 0,
      confirmedBookings: confirmedBookingsResult.count || 0,
      cancelledBookings: cancelledBookingsResult.count || 0,
      completedBookings: completedBookingsResult.count || 0
    }
  } catch (error: any) {
    console.error('Dashboard stats error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

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
