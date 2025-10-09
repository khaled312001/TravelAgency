import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    // Get booking distribution by status
    const { data: bookingStats } = await supabase
      .from('bookings')
      .select('status')
    
    const bookingDistribution = [
      { type: 'مؤكد', count: bookingStats?.filter(b => b.status === 'confirmed').length || 0, color: '#10B981' },
      { type: 'في الانتظار', count: bookingStats?.filter(b => b.status === 'pending').length || 0, color: '#F59E0B' },
      { type: 'ملغي', count: bookingStats?.filter(b => b.status === 'cancelled').length || 0, color: '#EF4444' },
      { type: 'مكتمل', count: bookingStats?.filter(b => b.status === 'completed').length || 0, color: '#3B82F6' }
    ]

    // Calculate percentages
    const totalBookings = bookingDistribution.reduce((sum, item) => sum + item.count, 0)
    bookingDistribution.forEach(item => {
      item.percentage = totalBookings > 0 ? Math.round((item.count / totalBookings) * 100) : 0
    })

    // Get monthly sales data (last 6 months)
    const monthlySales = []
    const currentDate = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('ar-SA', { month: 'long' })
      
      // Get bookings for this month
      const startDate = date.toISOString()
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString()
      
      const { data: monthlyBookings } = await supabase
        .from('bookings')
        .select('total_price')
        .eq('status', 'confirmed')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
      
      const amount = monthlyBookings?.reduce((sum, booking) => sum + (booking.total_price || 0), 0) || 0
      
      monthlySales.push({
        month: monthName,
        amount: amount
      })
    }

    return {
      bookingDistribution,
      monthlySales
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch chart data'
    })
  }
})
