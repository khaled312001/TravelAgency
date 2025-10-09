export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid email format'
      })
    }

    // Get Supabase client using Nuxt module
    const supabase = serverSupabaseServiceRole(event)

    // Insert contact message
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone,
          subject: body.subject || 'رسالة تواصل',
          message: body.message,
          status: 'unread',
          type: body.type || 'inquiry',
          package_id: body.package_id || null,
          package_name: body.package_name || null
        }
      ])
      .select()

    if (error) {
      console.error('Database error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save contact message'
      })
    }

    return {
      success: true,
      message: 'تم إرسال رسالتك بنجاح',
      data: data[0]
    }

  } catch (error: any) {
    console.error('Contact form error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
