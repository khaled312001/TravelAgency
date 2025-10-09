export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    console.log('Contact form data received:', body)
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name, email, message'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // For now, just log the data and return success
    // This will be replaced with database storage later
    console.log('Contact message received:', {
      name: body.name,
      email: body.email,
      phone: body.phone || 'Not provided',
      subject: body.subject || 'رسالة تواصل',
      message: body.message,
      type: body.type || 'inquiry',
      timestamp: new Date().toISOString()
    })

    // Simulate successful save
    const mockData = {
      id: 'temp-' + Date.now(),
      name: body.name,
      email: body.email,
      phone: body.phone || null,
      subject: body.subject || 'رسالة تواصل',
      message: body.message,
      status: 'unread',
      type: body.type || 'inquiry',
      created_at: new Date().toISOString()
    }

    return {
      success: true,
      message: 'تم إرسال رسالتك بنجاح',
      data: mockData
    }

  } catch (error: any) {
    console.error('Contact form error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
