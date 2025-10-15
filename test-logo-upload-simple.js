import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Create a simple test image file
const testImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')

async function testLogoUpload() {
  try {
    console.log('🧪 Testing logo upload API...')
    
    // Create test file
    const testFilePath = path.join(__dirname, 'test-logo.png')
    fs.writeFileSync(testFilePath, testImageData)
    console.log('✅ Test image created:', testFilePath)
    
    // Create FormData
    const FormData = (await import('form-data')).default
    const form = new FormData()
    form.append('file', fs.createReadStream(testFilePath), {
      filename: 'test-logo.png',
      contentType: 'image/png'
    })
    
    // Test the API
    const response = await fetch('http://localhost:3000/api/admin/upload', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    })
    
    const result = await response.json()
    console.log('📤 Upload response:', result)
    
    if (result.success) {
      console.log('✅ Upload successful!')
      console.log('🔗 Image URL:', result.data.url)
    } else {
      console.log('❌ Upload failed:', result)
    }
    
    // Clean up
    fs.unlinkSync(testFilePath)
    console.log('🧹 Test file cleaned up')
    
  } catch (error) {
    console.error('❌ Test error:', error)
  }
}

testLogoUpload()
