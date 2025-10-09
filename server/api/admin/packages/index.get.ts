export default defineEventHandler(async (event) => {
  try {
    console.log('Fetching packages...')
    
    // Get query parameters
    const query = getQuery(event)
    const { page = 1, limit = 10, search } = query

    // Return mock data for now
    const mockPackages = [
      {
        id: '1',
        title_ar: 'رحلة باريس الرومانسية',
        title_en: 'Romantic Paris Trip',
        description_ar: 'رحلة رومانسية إلى مدينة النور',
        description_en: 'Romantic trip to the City of Light',
        price: 2500,
        duration_days: 7,
        image_url: '/images/packages/paris.jpg',
        hero_image_url: '/images/packages/paris-hero.jpg',
        featured: true,
        created_at: '2025-01-09T10:00:00Z'
      },
      {
        id: '2',
        title_ar: 'مغامرة تايلاند',
        title_en: 'Thailand Adventure',
        description_ar: 'مغامرة مثيرة في تايلاند',
        description_en: 'Exciting adventure in Thailand',
        price: 1800,
        duration_days: 10,
        image_url: '/images/packages/thailand.jpg',
        hero_image_url: '/images/packages/thailand-hero.jpg',
        featured: true,
        created_at: '2025-01-09T09:00:00Z'
      },
      {
        id: '3',
        title_ar: 'جولة لندن الكلاسيكية',
        title_en: 'Classic London Tour',
        description_ar: 'جولة كلاسيكية في لندن',
        description_en: 'Classic tour of London',
        price: 2200,
        duration_days: 5,
        image_url: '/images/packages/london.jpg',
        hero_image_url: '/images/packages/london-hero.jpg',
        featured: false,
        created_at: '2025-01-09T08:00:00Z'
      },
      {
        id: '4',
        title_ar: 'رحلة إسطنبول السحرية',
        title_en: 'Magical Istanbul Trip',
        description_ar: 'رحلة سحرية إلى إسطنبول',
        description_en: 'Magical trip to Istanbul',
        price: 1500,
        duration_days: 6,
        image_url: '/images/packages/istanbul.jpg',
        hero_image_url: '/images/packages/istanbul-hero.jpg',
        featured: true,
        created_at: '2025-01-09T07:00:00Z'
      },
      {
        id: '5',
        title_ar: 'مغامرة المغرب',
        title_en: 'Morocco Adventure',
        description_ar: 'مغامرة في المغرب الساحر',
        description_en: 'Adventure in magical Morocco',
        price: 1200,
        duration_days: 8,
        image_url: '/images/packages/morocco.jpg',
        hero_image_url: '/images/packages/morocco-hero.jpg',
        featured: false,
        created_at: '2025-01-09T06:00:00Z'
      }
    ]

    // Apply filters
    let filteredPackages = mockPackages

    if (search) {
      const searchLower = search.toLowerCase()
      filteredPackages = filteredPackages.filter(pkg => 
        pkg.title_ar.toLowerCase().includes(searchLower) ||
        pkg.title_en.toLowerCase().includes(searchLower) ||
        pkg.description_ar.toLowerCase().includes(searchLower) ||
        pkg.description_en.toLowerCase().includes(searchLower)
      )
    }

    // Apply pagination
    const pageNum = Number(page)
    const limitNum = Number(limit)
    const from = (pageNum - 1) * limitNum
    const to = from + limitNum
    const paginatedPackages = filteredPackages.slice(from, to)

    console.log('Packages fetched successfully:', paginatedPackages.length)

    return {
      packages: paginatedPackages,
      total: filteredPackages.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(filteredPackages.length / limitNum)
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
