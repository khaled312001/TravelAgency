const http = require('http')

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/admin/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
}

const postData = JSON.stringify({
  email: 'admin@wonderland.com',
  password: 'admin123'
})

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`)
  console.log(`Headers: ${JSON.stringify(res.headers)}`)
  
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  })
  
  res.on('end', () => {
    console.log('Response:', data)
  })
})

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`)
})

req.write(postData)
req.end()
