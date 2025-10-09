import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Booking ID is required'
      })
    }

    // Delete booking
    const { error: bookingError } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id)

    if (bookingError) {
      throw createError({
        statusCode: 400,
        statusMessage: bookingError.message
      })
    }

    return {
      success: true,
      message: 'Booking deleted successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete booking'
    })
  }
})
