import { createClient } from '@supabase/supabase-js'
import { uploadBase64Image } from '~/utils/cloudinary'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    console.log('Creating destination with data:', body)

    // Validate required fields
    const requiredFields = ['name_ar', 'name_en', 'region_ar', 'region_en', 'location_type_ar', 'location_type_en', 'destination_type_ar', 'destination_type_en']
    for (const field of requiredFields) {
      if (!body[field]) {
        throw createError({
          statusCode: 400,
          statusMessage: `Field ${field} is required`
        })
      }
    }

    // Handle image upload to Cloudinary
    let mainImageUrl = ''
    if (body.main_image) {
      if (body.main_image.startsWith('data:image/')) {
        // Base64 image - upload to Cloudinary
        try {
          const result = await uploadBase64Image(body.main_image, 'destinations')
          mainImageUrl = result.secure_url
          console.log('Image uploaded to Cloudinary:', mainImageUrl)
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError)
          // Continue without image if upload fails
        }
      } else if (body.main_image.startsWith('http')) {
        // Already a URL - use directly
        mainImageUrl = body.main_image
      }
    }

    // Create destination
    const { data: destinationData, error: destinationError } = await supabase
      .from('destinations')
      .insert({
        name_ar: body.name_ar,
        name_en: body.name_en,
        description_ar: body.description_ar || '',
        description_en: body.description_en || '',
        region_ar: body.region_ar,
        region_en: body.region_en,
        location_type_ar: body.location_type_ar,
        location_type_en: body.location_type_en,
        destination_type_ar: body.destination_type_ar,
        destination_type_en: body.destination_type_en,
        main_image: mainImageUrl,
        featured: body.featured || false,
        status: body.status || 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (destinationError) {
      console.error('Supabase error:', destinationError)
      throw createError({
        statusCode: 400,
        statusMessage: destinationError.message
      })
    }

    console.log('Destination created successfully:', destinationData)

    return {
      success: true,
      destination: destinationData
    }
  } catch (error: any) {
    console.error('Error creating destination:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create destination: ${error.message}`
    })
  }
})
