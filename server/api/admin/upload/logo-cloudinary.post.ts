import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'dwpbixx3o',
  api_key: '457217934572426',
  api_secret: 'p75oOG1U8c_mMf-TAqrziSbGxBA'
})

export default defineEventHandler(async (event) => {
  try {
    console.log('Cloudinary logo upload API called')
    
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
      
      // Generate unique filename
      const timestamp = Date.now()
      const randomString = Math.random().toString(36).substring(2, 15)
      const extension = filename.split('.').pop() || 'png'
      const newFilename = `logo-${timestamp}-${randomString}.${extension}`
      
      try {
        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(image, {
          public_id: `logos/${newFilename}`,
          folder: 'worldtripagency/logos',
          resource_type: 'image',
          transformation: [
            { width: 200, height: 60, crop: 'fit' },
            { quality: 'auto' }
          ]
        })
        
        console.log('Cloudinary upload result:', result)
        
        return {
          success: true,
          data: {
            url: result.secure_url,
            filename: newFilename,
            originalName: filename,
            size: result.bytes,
            type: result.format
          }
        }
      } catch (uploadError) {
        console.error('Cloudinary upload error:', uploadError)
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to upload to Cloudinary'
        })
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
