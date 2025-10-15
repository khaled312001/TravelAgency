import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  try {
    console.log('Simple logo upload API called')
    
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
      
      // Create uploads directory
      const uploadsDir = join(process.cwd(), 'public', 'uploads', 'logos')
      
      try {
        await mkdir(uploadsDir, { recursive: true })
        console.log('Directory created:', uploadsDir)
      } catch (dirError) {
        console.error('Error creating directory:', dirError)
        // Continue anyway, directory might already exist
      }
      
      // Save file
      const filePath = join(uploadsDir, newFilename)
      console.log('Saving file to:', filePath)
      
      try {
        await writeFile(filePath, imageBuffer)
        console.log('File saved successfully')
      } catch (writeError) {
        console.error('Error writing file:', writeError)
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to save file'
        })
      }
      
      // Return success response
      const fileUrl = `/api/uploads/logos/${newFilename}`
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
