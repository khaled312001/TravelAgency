import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    console.log('Fetching destinations from database...')
    
    // Get query parameters
    const query = getQuery(event)
    const { featured, country } = query

    // Build query
    let supabaseQuery = supabase
      .from('destinations')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (featured) {
      supabaseQuery = supabaseQuery.eq('featured', featured === 'true')
    }

    if (country) {
      if (country === 'Saudi Arabia') {
        supabaseQuery = supabaseQuery.eq('country', country)
      } else if (query['country.ne']) {
        supabaseQuery = supabaseQuery.neq('country', query['country.ne'])
      } else {
        supabaseQuery = supabaseQuery.eq('country', country)
      }
    }

    // Execute query
    const { data: destinations, error } = await supabaseQuery

    if (error) {
      console.error('Supabase error:', error)
      throw createError({
        statusCode: 500,
        statusMessage: error.message
      })
    }

    // Map destinations to the format expected by the frontend
    const mappedDestinations = destinations?.map(dest => ({
      id: dest.id,
      name: {
        ar: dest.name_ar,
        en: dest.name_en
      },
      description: {
        ar: dest.description_ar || '',
        en: dest.description_en || ''
      },
      region: {
        ar: dest.country,
        en: dest.country
      },
      locationType: {
        id: 'mixed',
        name: {
          ar: 'متنوع',
          en: 'Mixed'
        }
      },
      destinationType: {
        id: 'cultural',
        name: {
          ar: 'ثقافي',
          en: 'Cultural'
        }
      },
      mainImage: dest.image_url || '/images/placeholder-destination.jpg',
      featured: dest.featured || false,
      coordinates: {
        latitude: 0,
        longitude: 0
      }
    })) || []

    console.log('Destinations fetched successfully:', mappedDestinations.length)

    return {
      destinations: mappedDestinations
    }
  } catch (error: any) {
    console.error('Destinations fetch error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch destinations: ${error.message}`
    })
  }
})
