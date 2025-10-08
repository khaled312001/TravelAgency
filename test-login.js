const testLogin = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/admin/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'admin@wonderland.com',
        password: 'admin123'
      })
    })
    
    const data = await response.json()
    console.log('Response status:', response.status)
    console.log('Response data:', data)
  } catch (error) {
    console.error('Error:', error)
  }
}

testLogin()
