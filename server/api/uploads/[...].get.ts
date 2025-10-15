import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    const url = getRequestURL(event)
    const path = url.pathname.replace('/api/uploads/', '')
    
    if (!path) {
      throw createError({
        statusCode: 400,
        statusMessage: 'File path is required'
      })
    }
    
    console.log('Requested file path:', path)
    
    // Construct file path
    const filePath = join(process.cwd(), 'public', 'uploads', path)
    console.log('Constructed file path:', filePath)
    
    // Security check - ensure file is within uploads directory
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    console.log('Uploads directory:', uploadsDir)
    console.log('File path starts with uploads dir:', filePath.startsWith(uploadsDir))
    
    if (!filePath.startsWith(uploadsDir)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Access denied'
      })
    }
    
    // Check if file exists
    console.log('File exists:', existsSync(filePath))
    if (!existsSync(filePath)) {
      throw createError({
        statusCode: 404,
        statusMessage: 'File not found'
      })
    }
    
    // Read file
    const fileBuffer = await readFile(filePath)
    
    // Determine content type based on file extension
    const ext = path.split('.').pop()?.toLowerCase()
    let contentType = 'application/octet-stream'
    
    switch (ext) {
      case 'png':
        contentType = 'image/png'
        break
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg'
        break
      case 'gif':
        contentType = 'image/gif'
        break
      case 'svg':
        contentType = 'image/svg+xml'
        break
      case 'webp':
        contentType = 'image/webp'
        break
    }
    
    // Set headers
    setHeader(event, 'Content-Type', contentType)
    setHeader(event, 'Cache-Control', 'public, max-age=2592000') // 30 days
    setHeader(event, 'Access-Control-Allow-Origin', '*')
    setHeader(event, 'Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS')
    
    return fileBuffer
    
  } catch (error) {
    console.error('Error serving file:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to serve file'
    })
  }
})
