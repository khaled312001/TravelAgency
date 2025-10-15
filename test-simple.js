const testImageData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64')
const base64Data = `data:image/png;base64,${testImageData.toString('base64')}`

fetch('http://localhost:3000/api/admin/upload', {
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
  }
})
.catch(err => console.error('Error:', err))
