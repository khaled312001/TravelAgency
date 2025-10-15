import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    console.log('Fetching packages from database with query:', query)
    
    // Build the query
    let supabaseQuery = supabase
      .from('packages')
      .select('id, title_ar, title_en, description_ar, description_en, price, duration_days, max_persons, travel_period, featured, image_url, hero_image_url, created_at, updated_at')
    
    // Apply filters
    if (query.search) {
      supabaseQuery = supabaseQuery.or(`title_ar.ilike.%${query.search}%,title_en.ilike.%${query.search}%,description_ar.ilike.%${query.search}%,description_en.ilike.%${query.search}%`)
    }
    
    if (query.status) {
      const isFeatured = query.status === 'featured'
      supabaseQuery = supabaseQuery.eq('featured', isFeatured)
    }
    
    if (query.category) {
      supabaseQuery = supabaseQuery.eq('travel_period', query.category)
    }
    
    // Apply ordering
    supabaseQuery = supabaseQuery.order('title_ar', { ascending: true })
    
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