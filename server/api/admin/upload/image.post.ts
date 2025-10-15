import { createClient } from '@supabase/supabase-js'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    console.log('Admin upload image API called')
    
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      console.log('No file uploaded')
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    const file = formData[0]
    console.log('File received:', {
      filename: file.filename,
      type: file.type,
      size: file.data?.length
    })

    if (!file.data || !file.filename) {
      console.log('Invalid file data')
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file data'
      })
    }

    // Additional file validation
    if (!Buffer.isBuffer(file.data)) {
      console.log('File data is not a buffer')
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file data format'
      })
    }

    if (file.data.length === 0) {
      console.log('File is empty')
      throw createError({
        statusCode: 400,
        statusMessage: 'File is empty'
      })
    }

    const fileName = file.filename || 'uploaded-image'
    const fileType = file.type || 'image/jpeg'
    const fileData = file.data

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(fileType)) {
      console.log('Invalid file type:', fileType)
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file type. Only images are allowed.'
      })
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (fileData.length > maxSize) {
      console.log('File too large:', fileData.length)
      throw createError({
        statusCode: 400,
        statusMessage: 'File too large. Maximum size is 2MB.'
      })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const fileExtension = fileName.split('.').pop() || 'jpg'
    const uniqueFileName = `logo-${timestamp}.${fileExtension}`
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'logos')
    console.log('Creating directory:', uploadsDir)
    
    try {
      await mkdir(uploadsDir, { recursive: true })
      console.log('Directory created successfully')
    } catch (dirError) {
      console.error('Error creating directory:', dirError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create upload directory'
      })
    }
    
    // Save file to public/uploads/logos directory
    const filePath = join(uploadsDir, uniqueFileName)
    console.log('Saving file to:', filePath)
    
    try {
      await writeFile(filePath, fileData)
      console.log('File saved successfully')
    } catch (writeError) {
      console.error('Error writing file:', writeError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save file'
      })
    }
    
    // Return the public URL
    const publicUrl = `/uploads/logos/${uniqueFileName}`
    console.log('File uploaded successfully:', publicUrl)
    
    return {
      success: true,
      data: {
        url: publicUrl,
        filename: uniqueFileName,
        originalName: fileName,
        size: fileData.length,
        type: fileType
      }
    }
  } catch (error) {
    console.error('Error uploading image:', error)
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to upload image: ${error.message}`
    })
  }
})
