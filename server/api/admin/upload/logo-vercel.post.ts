import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    console.log('Vercel logo upload API called')
    
    // Get the raw body
    const body = await readBody(event)
    console.log('Body received:', typeof body, Object.keys(body || {}))
    
    // Check if it's a base64 image
    if (body && body.image && body.filename) {
      const { image, filename } = body
      
      // Validate base64 image
      if (!image.startsWith('data:image/')) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Invalid image format'
        })
      }
      
      // Extract image data
      const base64Data = image.split(',')[1]
      const imageBuffer = Buffer.from(base64Data, 'base64')
      
      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = filename.split('.').pop() || 'png'
      const newFilename = `logo-${timestamp}-${randomString}.${extension}`
      
      // Upload to Supabase Storage
      const supabase = createClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )
      
      const { data, error } = await supabase.storage
        .from('uploads')
        .upload(`logos/${newFilename}`, imageBuffer, {
          contentType: 'image/png',
          cacheControl: '3600',
          upsert: false
        })
      
      if (error) {
        console.error('Supabase upload error:', error)
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to upload to storage'
        })
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('uploads')
        .getPublicUrl(`logos/${newFilename}`)
      
      const fileUrl = urlData.publicUrl
      console.log('File uploaded successfully:', fileUrl)
      
      return {
        success: true,
        data: {
          url: fileUrl,
          filename: newFilename,
          originalName: filename,
          size: imageBuffer.length,
          type: 'image/png'
        }
      }
    }
    
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid request body'
    })
    
  } catch (error) {
    console.error('Error uploading logo:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Upload failed: ${error.message}`
    })
  }
})
