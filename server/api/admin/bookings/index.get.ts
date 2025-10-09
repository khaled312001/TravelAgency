import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    // Get bookings from seo_settings table
    const { data: bookingsData, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page', 'bookings')
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch bookings'
      })
    }

    // Parse bookings from JSON
    let bookings = JSON.parse(bookingsData.description_ar || '[]')
    const statusLabels = JSON.parse(bookingsData.description_en || '{}').status_labels || {}
    const paymentLabels = JSON.parse(bookingsData.description_en || '{}').payment_labels || {}

    // Apply filters
    if (query.status) {
      bookings = bookings.filter((booking: any) => booking.status === query.status)
    }

    if (query.package_id) {
      bookings = bookings.filter((booking: any) => booking.package_id === query.package_id)
    }

    if (query.date_from) {
      bookings = bookings.filter((booking: any) => 
        booking.travel_date >= query.date_from
      )
    }

    if (query.search) {
      const searchTerm = (query.search as string).toLowerCase()
      bookings = bookings.filter((booking: any) => 
        booking.customer_name.toLowerCase().includes(searchTerm) ||
        booking.customer_email.toLowerCase().includes(searchTerm) ||
        booking.package_title.toLowerCase().includes(searchTerm) ||
        booking.destination.toLowerCase().includes(searchTerm)
      )
    }

    // Sort by created_at descending
    bookings.sort((a: any, b: any) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )

    // Add status and payment labels
    bookings = bookings.map((booking: any) => ({
      ...booking,
      status_label: statusLabels[booking.status] || booking.status,
      payment_status: booking.paid_amount === 0 ? 'unpaid' : 
                     booking.paid_amount < booking.total_price ? 'partial' : 'paid',
      payment_label: booking.paid_amount === 0 ? paymentLabels.unpaid || 'غير مدفوع' :
                     booking.paid_amount < booking.total_price ? paymentLabels.partial || 'مدفوع جزئياً' :
                     paymentLabels.paid || 'مدفوع بالكامل'
    }))

    return {
      success: true,
      bookings,
      total: bookings.length,
      status_labels: statusLabels,
      payment_labels: paymentLabels
    }
  } catch (error) {
    console.error('Error fetching bookings:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})