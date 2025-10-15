const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
  try {
    console.log('Testing upload API...');
    
    // Create a simple test image file (PNG header)
    const pngHeader = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    const testImageContent = Buffer.concat([pngHeader, Buffer.from('test image data')]);
    fs.writeFileSync('test-image.png', testImageContent);
    
    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream('test-image.png'), {
      filename: 'test-image.png',
      contentType: 'image/png'
    });
    
    // Test the API
    const response = await fetch('http://localhost:3001/api/admin/upload/image', {
      method: 'POST',
      body: form,
      headers: form.getHeaders()
    });
    
    const result = await response.json();
    console.log('Response status:', response.status);
    console.log('Response:', result);
    
    // Clean up
    fs.unlinkSync('test-image.png');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testUpload();
