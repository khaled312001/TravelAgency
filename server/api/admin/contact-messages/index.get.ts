export default defineEventHandler(async (event) => {
  try {
    console.log('Fetching contact messages...')
    
    // Try to get Supabase client using Nuxt module first
    let supabase
    try {
      supabase = serverSupabaseServiceRole(event)
    } catch (supabaseError) {
      console.log('Nuxt Supabase not available, using direct client')
      // Fallback to direct Supabase client
      const { createClient } = await import('@supabase/supabase-js')
      const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
      const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
      supabase = createClient(supabaseUrl, supabaseKey)
    }
    
    if (!supabase) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Supabase client not available'
      })
    }

    // Get query parameters
    const query = getQuery(event)
    const status = query.status as string
    const type = query.type as string
    const search = query.search as string

    console.log('Query parameters:', { status, type, search })

    // Build query
    let queryBuilder = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (status) {
      queryBuilder = queryBuilder.eq('status', status)
    }

    if (type) {
      queryBuilder = queryBuilder.eq('type', type)
    }

    if (search) {
      queryBuilder = queryBuilder.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%,message.ilike.%${search}%`)
    }

    const { data, error } = await queryBuilder

    if (error) {
      console.error('Database error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    console.log('Contact messages fetched successfully:', data?.length || 0)

    return {
      success: true,
      data: data || []
    }

  } catch (error: any) {
    console.error('Contact messages fetch error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})
