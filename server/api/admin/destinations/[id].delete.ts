import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Destination ID is required'
      })
    }

    // Delete destination
    const { error: destinationError } = await supabase
      .from('destinations')
      .delete()
      .eq('id', id)

    if (destinationError) {
      throw createError({
        statusCode: 400,
        statusMessage: destinationError.message
      })
    }

    return {
      success: true,
      message: 'Destination deleted successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete destination'
    })
  }
})
