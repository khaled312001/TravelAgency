import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const bookingId = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!bookingId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Booking ID is required'
      })
    }

    if (!body || typeof body !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request body'
      })
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
    
    // Find booking index
    const bookingIndex = existingBookings.findIndex((booking: any) => booking.id === bookingId)
    
    if (bookingIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Booking not found'
      })
    }

    // Update booking
    const updatedBooking = {
      ...existingBookings[bookingIndex],
      ...body,
      updated_at: new Date().toISOString()
    }

    // Replace booking in array
    existingBookings[bookingIndex] = updatedBooking

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
        statusMessage: 'Failed to update booking'
      })
    }

    return {
      success: true,
      message: 'Booking updated successfully',
      booking: updatedBooking
    }
  } catch (error) {
    console.error('Error updating booking:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})