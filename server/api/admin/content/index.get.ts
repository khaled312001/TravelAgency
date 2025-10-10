import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Supabase configuration missing'
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get content from database
    const { data, error } = await supabase
      .from('site_content')
      .select('*')
      .eq('page', 'homepage')
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch content'
      })
    }

    // Return content or empty object if not found
    return {
      success: true,
      data: data?.content || null
    }
  } catch (error) {
    console.error('Error fetching content:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
