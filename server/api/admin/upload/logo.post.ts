import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    console.log('Logo upload API called')
    
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
      const fileUrl = `/uploads/logos/${newFilename}`
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
    
    // If not base64, try multipart form data
    const formData = await readMultipartFormData(event)
    console.log('Form data received:', formData ? formData.length : 'null')
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    const file = formData[0]
    if (!file.data || !file.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file data'
      })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.filename.split('.').pop() || 'png'
    const newFilename = `logo-${timestamp}-${randomString}.${extension}`
    
    // Create uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'logos')
    
    try {
      await mkdir(uploadsDir, { recursive: true })
      console.log('Directory created:', uploadsDir)
    } catch (dirError) {
      console.error('Error creating directory:', dirError)
    }
    
    // Save file
    const filePath = join(uploadsDir, newFilename)
    console.log('Saving file to:', filePath)
    
    try {
      await writeFile(filePath, file.data)
      console.log('File saved successfully')
    } catch (writeError) {
      console.error('Error writing file:', writeError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save file'
      })
    }
    
    // Return success response
    const fileUrl = `/uploads/logos/${newFilename}`
    console.log('File uploaded successfully:', fileUrl)
    
    return {
      success: true,
      data: {
        url: fileUrl,
        filename: newFilename,
        originalName: file.filename,
        size: file.data.length,
        type: file.type || 'image/png'
      }
    }
    
  } catch (error) {
    console.error('Error uploading logo:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Upload failed: ${error.message}`
    })
  }
})
