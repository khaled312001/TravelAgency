import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Booking ID is required'
      })
    }

    // Update booking
    const { data: bookingData, error: bookingError } = await supabase
      .from('bookings')
      .update({
        status: body.status,
        travel_date: body.travel_date || null,
        return_date: body.return_date || null,
        number_of_travelers: Number(body.number_of_travelers) || null,
        total_price: Number(body.total_price) || null,
        payment_status: body.payment_status || 'pending',
        notes: body.notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        packages:package_id (title_ar, title_en, price),
        users:user_id (name, email, phone)
      `)
      .single()

    if (bookingError) {
      throw createError({
        statusCode: 400,
        statusMessage: bookingError.message
      })
    }

    return {
      success: true,
      booking: bookingData
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update booking'
    })
  }
})
