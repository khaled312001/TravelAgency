import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function testLogoUpload() {
  try {
    console.log('🧪 Testing logo upload with correct API...')
    
    // Create a simple test image file
    const testImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
    const testFilePath = path.join(__dirname, 'test-logo-final.png')
    fs.writeFileSync(testFilePath, testImageData)
    console.log('✅ Test image created:', testFilePath)
    
    // Create FormData
    const FormData = (await import('form-data')).default
    const form = new FormData()
    form.append('file', fs.createReadStream(testFilePath), {
      filename: 'test-logo-final.png',
      contentType: 'image/png'
    })
    
    // Test the API with logo header
    const response = await fetch('http://localhost:3000/api/admin/upload', {
      method: 'POST',
      headers: {
        'x-upload-type': 'logo',
        ...form.getHeaders()
      },
      body: form
    })
    
    const result = await response.json()
    console.log('📤 Upload response:', result)
    
    if (result.success) {
      console.log('✅ Upload successful!')
      console.log('🔗 Image URL:', result.url)
      console.log('📁 Expected path: /uploads/logos/')
      
      // Test if the file is accessible
      const imageResponse = await fetch(`http://localhost:3000${result.url}`)
      console.log('🖼️ Image accessibility test:', imageResponse.status)
      
      if (imageResponse.ok) {
        console.log('✅ Image is accessible!')
      } else {
        console.log('❌ Image is not accessible')
      }
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
