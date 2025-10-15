import { createClient } from '@supabase/supabase-js'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded'
      })
    }

    const file = formData[0]
    const fileName = file.filename || 'uploaded-image'
    const fileType = file.type || 'image/jpeg'
    const fileData = file.data

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/svg+xml', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(fileType)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file type. Only images are allowed.'
      })
    }

    // Validate file size (2MB max)
    const maxSize = 2 * 1024 * 1024 // 2MB
    if (fileData.length > maxSize) {
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
    await mkdir(uploadsDir, { recursive: true })
    
    // Save file to public/uploads/logos directory
    const filePath = join(uploadsDir, uniqueFileName)
    await writeFile(filePath, fileData)
    
    // Return the public URL
    const publicUrl = `/uploads/logos/${uniqueFileName}`
    
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
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload image'
    })
  }
})
