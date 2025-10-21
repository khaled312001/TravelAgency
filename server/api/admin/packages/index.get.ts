import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    console.log('Fetching packages from database with query:', query)
    
    // Test basic connection first
    console.log('Testing Supabase connection...')
    const { data: testData, error: testError } = await supabase
      .from('packages')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('Supabase connection test failed:', testError)
      throw createError({
        statusCode: 500,
        statusMessage: `Database connection error: ${testError.message}`
      })
    }
    
    console.log('Supabase connection successful')
    
    // Try to detect which schema is being used
    console.log('Detecting database schema...')
    
    // First try the simple schema
    let supabaseQuery = supabase
      .from('packages')
      .select('id, title, description, price, duration_days, destination, image_url, hero_image_url, created_at, updated_at')
      .limit(1)
    
    const { data: testPackages, error: simpleSchemaError } = await supabaseQuery
    
    if (simpleSchemaError) {
      console.log('Simple schema failed, trying complex schema...')
      // Try the complex schema
      supabaseQuery = supabase
        .from('packages')
        .select('id, title_ar, title_en, description_ar, description_en, price, duration_days, max_persons, travel_period, featured, image_url, created_at, updated_at')
        .limit(1)
      
      const { data: complexTest, error: complexSchemaError } = await supabaseQuery
      
      if (complexSchemaError) {
        console.error('Both schemas failed:', { simpleSchemaError, complexSchemaError })
        throw createError({
          statusCode: 500,
          statusMessage: `Database schema detection failed: ${simpleSchemaError.message}`
        })
      }
      
      console.log('Using complex schema')
      // Use complex schema for the main query
      supabaseQuery = supabase
        .from('packages')
        .select('id, title_ar, title_en, description_ar, description_en, price, duration_days, max_persons, travel_period, featured, image_url, created_at, updated_at')
    } else {
      console.log('Using simple schema')
      // Use simple schema for the main query
      supabaseQuery = supabase
        .from('packages')
        .select('id, title, description, price, duration_days, destination, image_url, hero_image_url, created_at, updated_at')
    }
    
    // Apply filters based on detected schema
    if (query.search) {
      if (simpleSchemaError) {
        // Complex schema
        supabaseQuery = supabaseQuery.or(`title_ar.ilike.%${query.search}%,title_en.ilike.%${query.search}%,description_ar.ilike.%${query.search}%,description_en.ilike.%${query.search}%`)
      } else {
        // Simple schema
        supabaseQuery = supabaseQuery.or(`title.ilike.%${query.search}%,description.ilike.%${query.search}%,destination.ilike.%${query.search}%`)
      }
    }
    
    if (query.status) {
      if (simpleSchemaError) {
        // Complex schema - use featured field
        const isFeatured = query.status === 'featured'
        supabaseQuery = supabaseQuery.eq('featured', isFeatured)
      } else {
        // Simple schema - skip status filter
        console.log('Status filter not supported in simple schema')
      }
    }
    
    if (query.category) {
      if (simpleSchemaError) {
        // Complex schema - use travel_period
        supabaseQuery = supabaseQuery.eq('travel_period', query.category)
      } else {
        // Simple schema - use destination
        supabaseQuery = supabaseQuery.eq('destination', query.category)
      }
    }
    
    // Apply ordering
    if (simpleSchemaError) {
      // Complex schema
      supabaseQuery = supabaseQuery.order('title_ar', { ascending: true })
    } else {
      // Simple schema
      supabaseQuery = supabaseQuery.order('title', { ascending: true })
    }
    
    // Execute query
    console.log('Executing packages query...')
    const { data: packages, error } = await supabaseQuery

    if (error) {
      console.error('Database error:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      })
      throw createError({
        statusCode: 500,
        statusMessage: `Database error: ${error.message}`
      })
    }

    console.log('Packages fetched successfully:', packages?.length || 0)
    console.log('Sample package:', packages?.[0])

    // Map packages to consistent format
    const mappedPackages = packages?.map(pkg => {
      if (simpleSchemaError) {
        // Complex schema - map to simple format
        return {
          id: pkg.id,
          title: pkg.title_ar || pkg.title_en || 'عنوان الباقة',
          description: pkg.description_ar || pkg.description_en || 'وصف الباقة',
          price: pkg.price,
          duration_days: pkg.duration_days,
          destination: pkg.travel_period || 'وجهة غير محددة',
          image_url: pkg.image_url || '',
          hero_image_url: pkg.image_url || '', // Use same image for hero since hero_image_url doesn't exist
          created_at: pkg.created_at,
          updated_at: pkg.updated_at
        }
      } else {
        // Simple schema - return as is
        return pkg
      }
    }) || []

    return {
      success: true,
      packages: mappedPackages
    }

  } catch (error: any) {
    console.error('Packages fetch error:', error)
    console.error('Error stack:', error.stack)
    
    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: `Internal server error: ${error.message}`
    })
  }
})