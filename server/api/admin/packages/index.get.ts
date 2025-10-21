import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    console.log('Fetching packages from database with query:', query)
    
    // Build the query - use current database schema
    let supabaseQuery = supabase
      .from('packages')
      .select('id, title, description, price, duration_days, destination, image_url, created_at, updated_at')
    
    // Apply filters
    if (query.search) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query.search}%,description.ilike.%${query.search}%,destination.ilike.%${query.search}%`)
    }
    
    if (query.status) {
      // Since featured field doesn't exist in current schema, we'll skip this filter
      console.log('Status filter not supported in current schema')
    }
    
    if (query.category) {
      supabaseQuery = supabaseQuery.eq('destination', query.category)
    }
    
    // Apply ordering
    supabaseQuery = supabaseQuery.order('title', { ascending: true })
    
    // Execute query
    const { data: packages, error } = await supabaseQuery

    if (error) {
      console.error('Database error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    console.log('Packages fetched successfully:', packages?.length || 0)

    return {
      success: true,
      packages: packages || []
    }

  } catch (error: any) {
    console.error('Packages fetch error:', error)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})