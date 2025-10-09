import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    console.log('Fetching contact messages from database...')
    
    // Get query parameters
    const query = getQuery(event)
    const { status, search } = query

    // Build the query
    let supabaseQuery = supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (status && typeof status === 'string') {
      supabaseQuery = supabaseQuery.eq('status', status)
    }

    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase()
      supabaseQuery = supabaseQuery.or(`name.ilike.%${searchLower}%,email.ilike.%${searchLower}%,subject.ilike.%${searchLower}%,message.ilike.%${searchLower}%`)
    }

    // Execute the query
    const { data: messages, error } = await supabaseQuery

    if (error) {
      console.error('Database error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    console.log('Contact messages fetched successfully:', messages?.length || 0)

    return {
      success: true,
      data: messages || []
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
