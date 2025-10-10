import { createClient } from '@supabase/supabase-js'
import webpush from 'web-push'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body || !body.title || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and message are required'
      })
    }

    const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Configure web-push
    webpush.setVapidDetails(
      'mailto:info@worldtripagency.com',
      'BEl62iUYgUivxIkv69yViEuiBIa40HI8F7j7ZAd9cn9jKIHaMqI5t9Dg6Ok3U7e1zKqoAZ4j2twFJqOPWqQW60', // Public key
      'your-private-vapid-key' // Private key (you should generate your own)
    )

    // Get all subscriptions
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')

    if (error) {
      console.error('Error fetching subscriptions:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch subscriptions'
      })
    }

    if (!subscriptions || subscriptions.length === 0) {
      return {
        success: true,
        message: 'No subscriptions found',
        sent: 0
      }
    }

    // Send notifications to all subscriptions
    const notificationPayload = JSON.stringify({
      title: body.title,
      body: body.message,
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-64x64.png',
      data: {
        url: body.url || '/',
        timestamp: Date.now()
      },
      actions: [
        {
          action: 'open',
          title: 'فتح',
          icon: '/icons/icon-64x64.png'
        },
        {
          action: 'close',
          title: 'إغلاق',
          icon: '/icons/icon-64x64.png'
        }
      ]
    })

    let sentCount = 0
    const errors = []

    for (const subscription of subscriptions) {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: subscription.keys
          },
          notificationPayload
        )
        sentCount++
      } catch (error) {
        console.error('Error sending notification:', error)
        errors.push({
          subscription: subscription.id,
          error: error.message
        })
      }
    }

    return {
      success: true,
      message: `Notifications sent to ${sentCount} subscribers`,
      sent: sentCount,
      errors: errors.length > 0 ? errors : undefined
    }
  } catch (error) {
    console.error('Error sending notifications:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
