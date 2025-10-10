import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Subscription data is required'
      })
    }

    const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Store subscription in database
    const { error } = await supabase
      .from('push_subscriptions')
      .upsert({
        endpoint: body.endpoint,
        keys: body.keys,
        user_agent: getHeader(event, 'user-agent'),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })

    if (error) {
      console.error('Error storing subscription:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to store subscription'
      })
    }

    return {
      success: true,
      message: 'Subscription stored successfully'
    }
  } catch (error) {
    console.error('Error processing subscription:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
