import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  // Set body size limit to 50MB
  setHeader(event, 'content-length', '0')
  
  try {
    const body = await readBody(event)
    
    if (!body) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Content data is required'
      })
    }

    const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'

    if (!supabaseUrl || !supabaseServiceKey) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Supabase configuration missing'
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if content exists
    const { data: existingData, error: selectError } = await supabase
      .from('site_content')
      .select('id')
      .eq('page', 'homepage')
      .single()

    if (selectError && selectError.code !== 'PGRST116') {
      // Table might not exist, create it first
      console.log('Table might not exist, attempting to create...')
      return {
        success: false,
        message: 'Database table not found. Please run the SQL setup first.'
      }
    }

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
        console.error('Update error:', error)
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
        console.error('Insert error:', error)
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
