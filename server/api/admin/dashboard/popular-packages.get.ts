import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    // Get packages with booking counts
    const { data: packages } = await supabase
      .from('packages')
      .select(`
        id,
        title_ar,
        title_en,
        price,
        image_url,
        bookings:bookings(count)
      `)
      .order('created_at', { ascending: false })
      .limit(5)

    if (!packages) {
      return []
    }

    // Transform data to match expected format
    const popularPackages = packages.map(pkg => ({
      id: pkg.id,
      title: pkg.title_ar || pkg.title_en || 'غير محدد',
      price: pkg.price || 0,
      views: pkg.bookings?.[0]?.count || 0,
      image_url: pkg.image_url || '/images/placeholder-package.jpg'
    }))

    return popularPackages
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch popular packages'
    })
  }
})
