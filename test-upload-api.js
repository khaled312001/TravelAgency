const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

async function testUpload() {
  try {
    console.log('Testing upload API...');
    
    // Create a simple test file
    const testContent = 'This is a test image content';
    fs.writeFileSync('test-image.txt', testContent);
    
    // Create form data
    const form = new FormData();
    form.append('file', fs.createReadStream('test-image.txt'), {
      filename: 'test-image.txt',
      contentType: 'text/plain'
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
    fs.unlinkSync('test-image.txt');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testUpload();
