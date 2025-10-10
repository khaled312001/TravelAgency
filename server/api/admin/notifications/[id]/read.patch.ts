export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Notification ID is required'
      })
    }
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
    
    if (error) {
      console.error('Error updating notification:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update notification'
      })
    }
    
    return {
      success: true,
      message: 'Notification marked as read'
    }
    
  } catch (error) {
    console.error('Error in mark as read API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
