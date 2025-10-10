import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Content data is required'
      })
    }

    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Supabase configuration missing'
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if content exists
    const { data: existingData } = await supabase
      .from('site_content')
      .select('id')
      .eq('page', 'homepage')
      .single()

    if (existingData) {
      // Update existing content
      const { error } = await supabase
        .from('site_content')
        .update({
          content: body,
          updated_at: new Date().toISOString()
        })
        .eq('page', 'homepage')

      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to update content'
        })
      }
    } else {
      // Insert new content
      const { error } = await supabase
        .from('site_content')
        .insert({
          page: 'homepage',
          content: body,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })

      if (error) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Failed to save content'
        })
      }
    }

    return {
      success: true,
      message: 'Content saved successfully'
    }
  } catch (error) {
    console.error('Error saving content:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
