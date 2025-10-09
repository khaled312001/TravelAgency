import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    const supabase = serverSupabaseServiceRole(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Package ID is required'
      })
    }

    // Delete package options first (foreign key constraint)
    const { error: optionsError } = await supabase
      .from('package_options')
      .delete()
      .eq('package_id', id)

    if (optionsError) {
      console.warn('Failed to delete package options:', optionsError.message)
    }

    // Delete package
    const { error: packageError } = await supabase
      .from('packages')
      .delete()
      .eq('id', id)

    if (packageError) {
      throw createError({
        statusCode: 400,
        statusMessage: packageError.message
      })
    }

    return {
      success: true,
      message: 'Package deleted successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete package'
    })
  }
})
