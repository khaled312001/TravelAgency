import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Destination ID is required'
      })
    }

    // Update destination
    const { data: destinationData, error: destinationError } = await supabase
      .from('destinations')
      .update({
        name_ar: body.name_ar,
        name_en: body.name_en,
        description_ar: body.description_ar,
        description_en: body.description_en,
        country: body.country || null,
        city: body.city || null,
        image_url: body.image_url || null,
        featured: body.featured || false,
        status: body.status || 'active',
        type: body.type || 'international',
        best_time_to_visit: body.best_time_to_visit || null,
        average_temperature: body.average_temperature || null,
        currency: body.currency || null,
        language: body.language || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (destinationError) {
      throw createError({
        statusCode: 400,
        statusMessage: destinationError.message
      })
    }

    return {
      success: true,
      destination: destinationData
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update destination'
    })
  }
})
