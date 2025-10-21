import { uploadBase64Image } from '~/utils/cloudinary'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body.image) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Image data is required'
      })
    }

    if (!body.folder) {
      body.folder = 'packages'
    }

    // Upload image to Cloudinary
    const result = await uploadBase64Image(body.image, body.folder)
    
    return {
      success: true,
      image: {
        url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
      }
    }
  } catch (error: any) {
    console.error('Image upload error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to upload image: ${error.message}`
    })
  }
})