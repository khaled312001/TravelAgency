import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)

    // Get all stats in parallel
    const [
      { count: totalUsers },
      { count: totalPackages },
      { count: totalBookings },
      { count: totalDestinations },
      { count: newMessages },
      { count: confirmedBookings },
      { count: pendingBookings },
      { count: totalRevenue }
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }),
      supabase.from('packages').select('*', { count: 'exact', head: true }),
      supabase.from('bookings').select('*', { count: 'exact', head: true }),
      supabase.from('destinations').select('*', { count: 'exact', head: true }),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'unread'),
      supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'confirmed'),
      supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      supabase.from('bookings').select('total_price', { count: 'exact', head: true }).eq('status', 'confirmed')
    ])

    // Calculate total revenue
    const { data: revenueData } = await supabase
      .from('bookings')
      .select('total_price')
      .eq('status', 'confirmed')

    const totalRevenueAmount = revenueData?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0

    return {
      totalUsers: totalUsers || 0,
      totalPackages: totalPackages || 0,
      totalBookings: totalBookings || 0,
      totalDestinations: totalDestinations || 0,
      newMessages: newMessages || 0,
      confirmedBookings: confirmedBookings || 0,
      pendingBookings: pendingBookings || 0,
      totalRevenue: totalRevenueAmount
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch dashboard stats'
    })
  }
})
