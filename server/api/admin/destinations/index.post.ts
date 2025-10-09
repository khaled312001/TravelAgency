import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate required fields
    const requiredFields = ['name_ar', 'name_en', 'description_ar', 'description_en']
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Field ${field} is required`
        })
      }
    }

    // Create destination
    const { data: destinationData, error: destinationError } = await supabase
      .from('destinations')
      .insert({
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
        language: body.language || null
      })
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
      statusMessage: 'Failed to create destination'
    })
  }
})
