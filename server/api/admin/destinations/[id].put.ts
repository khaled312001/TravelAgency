import { createClient } from '@supabase/supabase-js'
import { uploadBase64Image } from '~/utils/cloudinary'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const destinationId = getRouterParam(event, 'id')
    const body = await readBody(event)
    console.log('Updating destination:', destinationId, body)

    if (!destinationId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Destination ID is required'
      })
    }

    // Handle image upload to Cloudinary if it's a new base64 image
    let imageUrl = body.image_url
    if (body.image_url && body.image_url.startsWith('data:image/')) {
      try {
        const result = await uploadBase64Image(body.image_url, 'destinations')
        imageUrl = result.secure_url
        console.log('Image uploaded to Cloudinary:', imageUrl)
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError)
        // Continue with existing image if upload fails
      }
    }

    // Update destination
    const { data: destinationData, error: destinationError } = await supabase
      .from('destinations')
      .update({
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
        image_url: imageUrl,
        featured: body.featured || false,
        status: body.status || 'active',
        updated_at: new Date().toISOString()
      })
      .eq('id', destinationId)
      .select()
      .single()

    if (destinationError) {
      console.error('Supabase error:', destinationError)
      throw createError({
        statusCode: 400,
        statusMessage: destinationError.message
      })
    }

    console.log('Destination updated successfully:', destinationData)

    return {
      success: true,
      destination: destinationData
    }
  } catch (error: any) {
    console.error('Error updating destination:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to update destination: ${error.message}`
    })
  }
})