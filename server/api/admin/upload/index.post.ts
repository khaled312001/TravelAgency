import { createClient } from '@supabase/supabase-js'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    console.log('Admin upload API called')
    
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      console.log('No files uploaded')
      throw createError({
        statusCode: 400,
        statusMessage: 'No files uploaded'
      })
    }

    const file = formData[0]
    if (!file.data || !file.filename) {
      console.log('Invalid file data')
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid file data'
      })
    }

    console.log('File details:', {
      filename: file.filename,
      type: file.type,
      size: file.data.length
    })

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
    if (!allowedTypes.includes(file.type || '')) {
      console.log('File type not allowed:', file.type)
      throw createError({
        statusCode: 400,
        statusMessage: 'File type not allowed. Only images (JPEG, PNG, WebP) and videos (MP4, WebM) are allowed.'
      })
    }

    // Validate file size (max 50MB for videos, 10MB for images)
    const maxSize = file.type?.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024
    if (file.data.length > maxSize) {
      console.log('File too large:', file.data.length, 'max:', maxSize)
      throw createError({
        statusCode: 400,
        statusMessage: `File too large. Max size: ${file.type?.startsWith('video/') ? '50MB' : '10MB'}`
      })
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = file.filename.split('.').pop()
    const newFilename = `${timestamp}_${randomString}.${extension}`

    // Determine upload directory based on file type
    const uploadDir = file.type?.startsWith('video/') ? 'videos' : 'images'
    const subDir = file.type?.startsWith('video/') ? 'hero' : 'home/heroSection'
    const fullPath = join(process.cwd(), 'public', uploadDir, subDir)

    console.log('Upload path:', fullPath)

    // Create directory if it doesn't exist
    if (!existsSync(fullPath)) {
      console.log('Creating directory:', fullPath)
      await mkdir(fullPath, { recursive: true })
    }

    // Save file
    const filePath = join(fullPath, newFilename)
    console.log('Saving file to:', filePath)
    await writeFile(filePath, file.data)

    // Return file URL
    const fileUrl = `/${uploadDir}/${subDir}/${newFilename}`
    console.log('File uploaded successfully:', fileUrl)

    return {
      success: true,
      url: fileUrl,
      filename: newFilename,
      originalName: file.filename,
      size: file.data.length,
      type: file.type
    }
  } catch (error: any) {
    console.error('Upload error details:', error)
    
    // If it's already a createError, re-throw it
    if (error.statusCode) {
      throw error
    }
    
    // Otherwise, wrap it in a generic error
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Upload failed'
    })
  }
})
