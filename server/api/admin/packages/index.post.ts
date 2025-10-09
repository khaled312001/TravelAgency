import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate required fields
    const requiredFields = ['title_ar', 'title_en', 'description_ar', 'description_en', 'price', 'duration_days']
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Field ${field} is required`
        })
      }
    }

    // Create package
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .insert({
        title_ar: body.title_ar,
        title_en: body.title_en,
        description_ar: body.description_ar,
        description_en: body.description_en,
        price: Number(body.price),
        duration_days: Number(body.duration_days),
        max_persons: Number(body.max_persons) || null,
        travel_period: body.travel_period || null,
        image_url: body.image_url || null,
        featured: body.featured || false,
        status: body.status || 'active',
        category: body.category || 'international'
      })
      .select()
      .single()

    if (packageError) {
      throw createError({
        statusCode: 400,
        statusMessage: packageError.message
      })
    }

    // Create package options if provided
    if (body.included_options) {
      const { error: optionsError } = await supabase
        .from('package_options')
        .insert({
          package_id: packageData.id,
          flight: body.included_options.flight || false,
          hotel: body.included_options.hotel || false,
          transportation: body.included_options.transportation || false,
          hotel_grade: body.included_options.hotelGrade || null
        })

      if (optionsError) {
        console.warn('Failed to create package options:', optionsError.message)
      }
    }

    return {
      success: true,
      package: packageData
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create package'
    })
  }
})
