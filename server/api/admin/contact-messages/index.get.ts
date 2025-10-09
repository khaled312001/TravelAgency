export default defineEventHandler(async (event) => {
  try {
    // Get Supabase client using Nuxt module
    const supabase = serverSupabaseServiceRole(event)

    // Get query parameters
    const query = getQuery(event)
    const status = query.status as string
    const type = query.type as string
    const search = query.search as string

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
        statusMessage: 'Failed to fetch contact messages'
      })
    }

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
      statusMessage: 'Internal server error'
    })
  }
})
