import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('POST /api/admin/packages - Received data:', {
      title: body.title,
      description: body.description,
      price: body.price,
      duration_days: body.duration_days,
      destination: body.destination,
      hasImageUrl: !!body.image_url,
      hasHeroImageUrl: !!body.hero_image_url,
      image_url: body.image_url,
      hero_image_url: body.hero_image_url
    })

    // Validate required fields based on current database schema (complex schema)
    if (!body.title_ar && !body.title) {
      console.error('Missing required field: title_ar')
      throw createError({
        statusCode: 400,
        statusMessage: 'Field title_ar is required'
      })
    }
    
    if (!body.price) {
      console.error('Missing required field: price')
      throw createError({
        statusCode: 400,
        statusMessage: 'Field price is required'
      })
    }
    
    if (!body.duration_days) {
      console.error('Missing required field: duration_days')
      throw createError({
        statusCode: 400,
        statusMessage: 'Field duration_days is required'
      })
    }

    // Create package with current database schema (complex schema with hero_image_url)
    const insertData = {
      title_ar: body.title_ar || body.title || 'عنوان الباقة',
      title_en: body.title_en || body.title || 'Package Title',
      description_ar: body.description_ar || body.description || 'وصف الباقة',
      description_en: body.description_en || body.description || 'Package Description',
      price: Number(body.price),
      duration_days: Number(body.duration_days),
      max_persons: body.max_persons || 1,
      travel_period: body.travel_period || body.destination || 'طوال السنة',
      image_url: body.image_url || 'https://via.placeholder.com/400x300?text=No+Image',
      hero_image_url: body.hero_image_url || body.image_url || 'https://via.placeholder.com/400x300?text=No+Hero+Image',
      featured: body.featured || false
    }
    
    console.log('Inserting package data:', insertData)
    
    const { data: packageData, error: packageError } = await supabase
      .from('packages')
      .insert(insertData)
      .select()
      .single()

    if (packageError) {
      console.error('Package creation error:', packageError)
      console.error('Error details:', {
        message: packageError.message,
        code: packageError.code,
        details: packageError.details,
        hint: packageError.hint
      })
      throw createError({
        statusCode: 400,
        statusMessage: packageError.message
      })
    }
    
    console.log('Package created successfully:', packageData)

    return {
      success: true,
      package: packageData
    }
  } catch (error: any) {
    console.error('Error creating package:', error)
    console.error('Error stack:', error.stack)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create package: ${error.message || 'Unknown error'}`
    })
  }
})
