import { createClient } from '@supabase/supabase-js'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields: name, email, message'
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

    // Create Supabase client with service role key
    const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
    const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.YourServiceRoleKeyHere'
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Insert contact message
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        {
          name: body.name,
          email: body.email,
          phone: body.phone || null,
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
        statusMessage: `Database error: ${error.message}`
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
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
