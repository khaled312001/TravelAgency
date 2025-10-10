export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false)
    
    if (error) {
      console.error('Error marking all notifications as read:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to mark all notifications as read'
      })
    }
    
    return {
      success: true,
      message: 'All notifications marked as read'
    }
    
  } catch (error) {
    console.error('Error in mark all read API:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
