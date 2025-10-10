export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body || !body.endpoint) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid subscription data'
      })
    }

    // For now, just log the subscription
    // In production, you would save this to your database
    console.log('New push subscription:', {
      endpoint: body.endpoint,
      keys: body.keys,
      userAgent: getHeader(event, 'user-agent'),
      timestamp: new Date().toISOString()
    })

    return {
      success: true,
      message: 'Successfully subscribed to push notifications'
    }
  } catch (error) {
    console.error('Error handling push subscription:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to process subscription'
    })
  }
})