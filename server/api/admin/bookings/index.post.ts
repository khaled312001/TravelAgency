import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body || typeof body !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request body'
      })
    }

    // Validate required fields
    const requiredFields = ['customer_name', 'customer_email', 'customer_phone', 'package_id', 'travel_date', 'participants_count', 'total_price']
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Missing required field: ${field}`
        })
      }
    }

    // Generate unique booking ID
    const bookingId = `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Create new booking object
    const newBooking = {
      id: bookingId,
      customer_name: body.customer_name,
      customer_email: body.customer_email,
      customer_phone: body.customer_phone,
      package_id: body.package_id,
      package_title: body.package_title || 'باقة غير محددة',
      destination: body.destination || 'وجهة غير محددة',
      travel_date: body.travel_date,
      participants_count: parseInt(body.participants_count),
      total_price: parseFloat(body.total_price),
      paid_amount: parseFloat(body.paid_amount || 0),
      status: body.status || 'pending',
      notes: body.notes || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // Get current bookings
    const { data: bookingsData, error: fetchError } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page', 'bookings')
      .single()

    if (fetchError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch current bookings'
      })
    }

    // Parse existing bookings
    const existingBookings = JSON.parse(bookingsData.description_ar || '[]')
    
    // Add new booking
    existingBookings.push(newBooking)

    // Update bookings in database
    const { error: updateError } = await supabase
      .from('seo_settings')
      .update({
        description_ar: JSON.stringify(existingBookings),
        updated_at: new Date().toISOString()
      })
      .eq('page', 'bookings')

    if (updateError) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save booking'
      })
    }

    return {
      success: true,
      message: 'Booking created successfully',
      booking: newBooking
    }
  } catch (error) {
    console.error('Error creating booking:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
