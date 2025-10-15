import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function testLogoAPI() {
  try {
    console.log('🧪 Testing logo API...')
    
    // Create a simple test image file
    const testImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
    const testFilePath = path.join(__dirname, 'test-logo-api.png')
    fs.writeFileSync(testFilePath, testImageData)
    console.log('✅ Test image created:', testFilePath)
    
    // Convert to base64
    const base64Data = `data:image/png;base64,${testImageData.toString('base64')}`
    
    // Test the API
    const response = await fetch('http://localhost:3000/api/admin/upload/logo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        image: base64Data,
        filename: 'test-logo-api.png'
      })
    })
    
    const result = await response.json()
    console.log('📤 Upload response:', result)
    
    if (result.success) {
      console.log('✅ Upload successful!')
      console.log('🔗 Image URL:', result.data.url)
      
      // Test if the file is accessible
      const imageResponse = await fetch(`http://localhost:3000${result.data.url}`)
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

testLogoAPI()
