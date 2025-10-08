import { createClient } from '@supabase/supabase-js'
import type { BookingDistribution, MonthlySales } from '~/types/admin'

export default defineEventHandler(async (event) => {
  try {
    // Verify admin authentication
    await verifyAdminAuth(event)
    
    // Create Supabase client with service role key
    const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get booking distribution data
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select(`
        status,
        packages (
          destination
        )
      `)

    if (bookingsError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch booking data'
      })
    }

    // Process booking distribution
    const bookingDistribution: BookingDistribution[] = [
      { type: 'رحلات داخلية', count: 0, percentage: 0, color: '#10B981' },
      { type: 'رحلات خارجية', count: 0, percentage: 0, color: '#F59E0B' },
      { type: 'عمرة', count: 0, percentage: 0, color: '#EF4444' },
      { type: 'رحلات ترفيهية', count: 0, percentage: 0, color: '#8B5CF6' }
    ]

    // Count bookings by type (simplified logic)
    bookings?.forEach(booking => {
      const destination = booking.packages?.destination?.toLowerCase() || ''
      if (destination.includes('مكة') || destination.includes('المدينة') || destination.includes('عمرة')) {
        bookingDistribution[2].count++ // عمرة
      } else if (destination.includes('دبي') || destination.includes('تركيا') || destination.includes('مصر')) {
        bookingDistribution[1].count++ // رحلات خارجية
      } else if (destination.includes('الرياض') || destination.includes('جدة') || destination.includes('الدمام')) {
        bookingDistribution[0].count++ // رحلات داخلية
      } else {
        bookingDistribution[3].count++ // رحلات ترفيهية
      }
    })

    // Calculate percentages
    const totalBookings = bookingDistribution.reduce((sum, item) => sum + item.count, 0)
    bookingDistribution.forEach(item => {
      item.percentage = totalBookings > 0 ? Math.round((item.count / totalBookings) * 100) : 0
    })

    // Get monthly sales data (last 6 months)
    const monthlySales: MonthlySales[] = []
    const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو']
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1)
      const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const { data: monthBookings, error: monthError } = await supabase
        .from('bookings')
        .select('total_price')
        .gte('created_at', startOfMonth.toISOString())
        .lte('created_at', endOfMonth.toISOString())
        .eq('status', 'confirmed')

      if (!monthError && monthBookings) {
        const totalAmount = monthBookings.reduce((sum, booking) => sum + booking.total_price, 0)
        monthlySales.push({
          month: months[5 - i],
          amount: totalAmount,
          bookings: monthBookings.length
        })
      } else {
        monthlySales.push({
          month: months[5 - i],
          amount: 0,
          bookings: 0
        })
      }
    }

    return {
      bookingDistribution,
      monthlySales
    }
  } catch (error: any) {
    console.error('Dashboard charts error:', error)
    
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
