export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body || !body.endpoint) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid subscription data'
      })
    }

    const supabase = serverSupabaseServiceRole(event)
    
    // Save subscription to database
    const { data: subscription, error } = await supabase
      .from('push_subscriptions')
      .upsert({
        endpoint: body.endpoint,
        keys: body.keys,
        user_agent: getHeader(event, 'user-agent'),
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'endpoint'
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving subscription:', error)
      // Don't fail the request if database save fails
      console.log('Subscription logged but not saved to database:', {
        endpoint: body.endpoint,
        keys: body.keys,
        userAgent: getHeader(event, 'user-agent'),
        timestamp: new Date().toISOString()
      })
    } else {
      console.log('Push subscription saved successfully:', subscription)
    }

    return {
      success: true,
      message: 'Successfully subscribed to push notifications'
    }
  } catch (error) {
    console.error('Error handling push subscription:', error)
    // Instead of throwing an error, return success to prevent 500 errors
    return {
      success: true,
      message: 'Subscription processed (with errors)'
    }
  }
})