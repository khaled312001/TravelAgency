import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function testSimpleUpload() {
  try {
    console.log('🧪 Testing simple upload...')
    
    // Create a simple test file
    const testImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
    const testFilePath = path.join(__dirname, 'test-simple.png')
    fs.writeFileSync(testFilePath, testImageData)
    console.log('✅ Test image created:', testFilePath)
    
    // Test with a simple fetch request
    const response = await fetch('http://localhost:3000/api/admin/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        test: 'data'
      })
    })
    
    const result = await response.json()
    console.log('📤 Response:', result)
    
    // Clean up
    fs.unlinkSync(testFilePath)
    console.log('🧹 Test file cleaned up')
    
  } catch (error) {
    console.error('❌ Test error:', error)
  }
}

testSimpleUpload()
