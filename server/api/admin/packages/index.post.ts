import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    // Validate required fields based on current database schema
    const requiredFields = ['title', 'description', 'price', 'duration_days', 'destination']
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Field ${field} is required`
        })
      }
    }

    // Create package with current database schema
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .insert({
        title: body.title_ar || body.title || 'عنوان الباقة',
        description: body.description_ar || body.description || 'وصف الباقة',
        price: Number(body.price),
        duration_days: Number(body.duration_days),
        destination: body.destination || 'وجهة غير محددة',
        image_url: body.image_url || body.hero_image_url || null
      })
      .select()
      .single()

    if (packageError) {
      console.error('Package creation error:', packageError)
      throw createError({
        statusCode: 400,
        statusMessage: packageError.message
      })
    }

    return {
      success: true,
      package: packageData
    }
  } catch (error) {
    console.error('Error creating package:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create package'
    })
  }
})
