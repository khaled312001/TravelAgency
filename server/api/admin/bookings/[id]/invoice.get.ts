import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const bookingId = getRouterParam(event, 'id')
    
    if (!bookingId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Booking ID is required'
      })
    }

    // Get booking data
    const { data: bookingsData, error: fetchError } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page', 'bookings')
      .single()

    if (fetchError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch booking data'
      })
    }

    // Parse bookings
    const bookings = JSON.parse(bookingsData.description_ar || '[]')
    const invoiceSettings = JSON.parse(bookingsData.keywords_ar || '{}').invoice_settings || {}
    
    // Find booking
    const booking = bookings.find((b: any) => b.id === bookingId)
    
    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Booking not found'
      })
    }

    // Generate invoice data
    const invoiceData = {
      invoice_number: `INV-${bookingId.split('-')[1]}-${Date.now()}`,
      invoice_date: new Date().toISOString().split('T')[0],
      due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      company: {
        name: invoiceSettings.company_name || 'وكالة أرض العجائب للسفر',
        address: invoiceSettings.company_address || 'الرياض، المملكة العربية السعودية',
        phone: invoiceSettings.company_phone || '+966500982394',
        email: invoiceSettings.company_email || 'info@worldtripagency.com',
        tax_number: invoiceSettings.tax_number || '1234567890',
        license_number: invoiceSettings.license_number || '73105863'
      },
      customer: {
        name: booking.customer_name,
        email: booking.customer_email,
        phone: booking.customer_phone
      },
      booking: {
        id: booking.id,
        package_title: booking.package_title,
        destination: booking.destination,
        travel_date: booking.travel_date,
        participants_count: booking.participants_count
      },
      items: [
        {
          description: `${booking.package_title} - ${booking.destination}`,
          quantity: booking.participants_count,
          unit_price: booking.total_price / booking.participants_count,
          total_price: booking.total_price
        }
      ],
      totals: {
        subtotal: booking.total_price,
        tax_rate: 15, // 15% VAT
        tax_amount: booking.total_price * 0.15,
        total: booking.total_price * 1.15,
        paid_amount: booking.paid_amount,
        balance_due: (booking.total_price * 1.15) - booking.paid_amount
      },
      status: booking.status,
      notes: booking.notes || ''
    }

    return {
      success: true,
      invoice: invoiceData
    }
  } catch (error) {
    console.error('Error generating invoice:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
