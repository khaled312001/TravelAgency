import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export default defineEventHandler(async (event) => {
  try {
    console.log('Simple upload API called')
    
    // Get the raw body
    const body = await readBody(event)
    console.log('Body received:', typeof body, body)
    
    // For now, return a mock response to test if the endpoint is reachable
    return {
      success: true,
      message: 'Simple upload endpoint is working',
      data: {
        url: '/uploads/test-image.png',
        filename: 'test-image.png',
        originalName: 'test-image.png',
        size: 1024,
        type: 'image/png'
      }
    }
    
  } catch (error) {
    console.error('Error in simple upload:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Upload failed: ${error.message}`
    })
  }
})
