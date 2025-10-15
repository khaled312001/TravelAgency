const testImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
const base64Data = `data:image/png;base64,${testImageData.toString('base64')}`

fetch('http://localhost:3000/api/admin/upload/logo-simple', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    image: base64Data,
    filename: 'test.png'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Response:', data)
  if (data.success) {
    console.log('Image URL:', data.data.url)
    
    // Test if the file is accessible
    return fetch(`http://localhost:3000${data.data.url}`)
  }
})
.then(res => {
  if (res) {
    console.log('Image accessibility test:', res.status)
    if (res.ok) {
      console.log('✅ Image is accessible!')
    } else {
      console.log('❌ Image is not accessible')
    }
  }
})
.catch(err => console.error('Error:', err))
