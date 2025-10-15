import { createClient } from '@supabase/supabase-js'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    console.log('Admin upload API called')
    console.log('Request method:', event.method)
    console.log('Request headers:', getHeaders(event))
    
    // Check content type
    const contentType = getHeader(event, 'content-type')
    console.log('Content-Type:', contentType)
    
    const formData = await readMultipartFormData(event)
    console.log('Form data received:', formData ? formData.length : 'null')
    console.log('Form data details:', formData)
    
    if (!formData || formData.length === 0) {
      console.log('No files uploaded - formData is null or empty')
      console.log('Request body type:', typeof event.body)
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

    console.log('Upload details:', {
      uploadDir,
      subDir,
      fullPath,
      cwd: process.cwd(),
      fileType: file.type
    })

    // Validate path is within public directory for security
    const publicPath = join(process.cwd(), 'public')
    if (!fullPath.startsWith(publicPath)) {
      console.error('Invalid upload path:', fullPath)
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid upload path'
      })
    }

    // Ensure public directory exists
    if (!existsSync(publicPath)) {
      console.error('Public directory does not exist:', publicPath)
      throw createError({
        statusCode: 500,
        statusMessage: 'Public directory not found. Please check server configuration.'
      })
    }

    // Create directory if it doesn't exist
    if (!existsSync(fullPath)) {
      console.log('Creating directory:', fullPath)
      try {
        await mkdir(fullPath, { recursive: true })
        console.log('Directory created successfully')
      } catch (mkdirError) {
        console.error('Error creating directory:', mkdirError)
        throw createError({
          statusCode: 500,
          statusMessage: `Failed to create upload directory: ${mkdirError.message}`
        })
      }
    }

    // Save file
    const filePath = join(fullPath, newFilename)
    console.log('Saving file to:', filePath)
    try {
      await writeFile(filePath, file.data)
      console.log('File saved successfully')
    } catch (writeError) {
      console.error('Error writing file:', writeError)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to save file: ${writeError.message}`
      })
    }

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
    console.error('Upload error details:', {
      message: error.message,
      stack: error.stack,
      statusCode: error.statusCode,
      name: error.name
    })
    
    // If it's already a createError, re-throw it
    if (error.statusCode) {
      throw error
    }
    
    // Handle specific error types
    if (error.code === 'ENOENT') {
      throw createError({
        statusCode: 500,
        statusMessage: 'Directory not found. Please check server configuration.'
      })
    }
    
    if (error.code === 'EACCES') {
      throw createError({
        statusCode: 500,
        statusMessage: 'Permission denied. Please check file permissions.'
      })
    }
    
    if (error.code === 'ENOSPC') {
      throw createError({
        statusCode: 500,
        statusMessage: 'No space left on device.'
      })
    }
    
    // Otherwise, wrap it in a generic error
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Upload failed due to server error'
    })
  }
})
