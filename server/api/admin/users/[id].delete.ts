import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'User ID is required'
      })
    }

    // Delete user
    const { error: userError } = await supabase
      .from('users')
      .delete()
      .eq('id', id)

    if (userError) {
      throw createError({
        statusCode: 400,
        statusMessage: userError.message
      })
    }

    return {
      success: true,
      message: 'User deleted successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete user'
    })
  }
})
