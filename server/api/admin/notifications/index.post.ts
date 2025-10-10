export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const body = await readBody(event)
    
    const { title, message, type = 'info', data } = body
    
    if (!title || !message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and message are required'
      })
    }
    
    const { data: notification, error } = await supabase
      .from('notifications')
      .insert({
        title,
        message,
        type,
        data: data || null,
        is_read: false
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating notification:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to create notification'
      })
    }
    
    return {
      success: true,
      notification,
      message: 'Notification created successfully'
    }
    
  } catch (error) {
    console.error('Error in create notification API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})