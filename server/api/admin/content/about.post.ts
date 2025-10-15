import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ueofktshvaqtxjsxvisv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'
)

export default defineEventHandler(async (event) => {
  try {
    // Set proper headers for UTF-8 encoding
    setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
    
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.about) {
      throw createError({
        statusCode: 400,
        statusMessage: 'About content is required'
      })
    }

    // Update about page content in site_content table
    const { data, error } = await supabase
      .from('site_content')
      .upsert({
        page: 'about',
        content: body.about,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'page'
      })
      .select()

    if (error) {
      console.error('Error updating about content:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update about content'
      })
    }

    return {
      success: true,
      message: 'About content updated successfully',
      data: data[0]
    }
  } catch (error: any) {
    console.error('Error in about content update:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
