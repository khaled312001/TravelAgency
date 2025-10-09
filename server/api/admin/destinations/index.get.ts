export default defineEventHandler(async (event) => {
  try {
    console.log('Fetching destinations from static data...')
    
    // Get query parameters
    const query = getQuery(event)
    const { page = 1, limit = 50, search, status, type, featured } = query

    // Static destinations data (from useDestinations composable)
    const saudiDestinations = [
      {
        id: 'riyadh',
        name_ar: 'الرياض',
        name_en: 'Riyadh',
        description_ar: 'مدينة عصرية تنهض من الصحراء، تمزج بين التراث التاريخي والرؤية المستقبلية',
        description_en: 'A modern metropolis rising from the desert, blending historical heritage with futuristic vision',
        region_ar: 'منطقة الرياض',
        region_en: 'Riyadh Region',
        location_type_ar: 'مدينة',
        location_type_en: 'Urban',
        destination_type_ar: 'حضري',
        destination_type_en: 'Metropolitan',
        main_image: '/images/destinations/saudi/riyadh/Riyadh1.jpeg',
        featured: true,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'red-sea',
        name_ar: 'البحر الأحمر',
        name_en: 'Red Sea',
        description_ar: 'ساحل نقي بمياه صافية وشعاب مرجانية ومنتجعات فاخرة',
        description_en: 'Pristine coastline with crystal-clear waters, coral reefs, and luxury resorts',
        region_ar: 'منطقة البحر الأحمر',
        region_en: 'Red Sea Region',
        location_type_ar: 'ساحلي',
        location_type_en: 'Coastal',
        destination_type_ar: 'شاطئي',
        destination_type_en: 'Beach',
        main_image: 'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg',
        featured: true,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'jeddah',
        name_ar: 'جدة',
        name_en: 'Jeddah',
        description_ar: 'مدينة ميناء تاريخية ذات تراث ثقافي غني وواجهة بحرية حديثة',
        description_en: 'Historic port city with a rich cultural heritage and modern waterfront',
        region_ar: 'منطقة مكة المكرمة',
        region_en: 'Makkah Region',
        location_type_ar: 'ساحلي',
        location_type_en: 'Coastal',
        destination_type_ar: 'ثقافي',
        destination_type_en: 'Cultural',
        main_image: '/images/destinations/saudi/jeddah/Jeddah1.jpeg',
        featured: true,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'makkah',
        name_ar: 'مكة المكرمة',
        name_en: 'Makkah',
        description_ar: 'أقدس مدينة في الإسلام، موطن المسجد الحرام والمواقع الدينية القديمة',
        description_en: 'The holiest city in Islam, home to the Grand Mosque and ancient religious sites',
        region_ar: 'منطقة مكة المكرمة',
        region_en: 'Makkah Region',
        location_type_ar: 'ديني',
        location_type_en: 'Religious',
        destination_type_ar: 'روحاني',
        destination_type_en: 'Spiritual',
        main_image: '/images/destinations/saudi/Makkah/Makkah1.jpeg',
        featured: true,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'medina',
        name_ar: 'المدينة المنورة',
        name_en: 'Medina',
        description_ar: 'ثاني أقدس مدينة في الإسلام، معروفة بأجوائها الهادئة ومساجدها التاريخية',
        description_en: 'The second-holiest city in Islam, known for its peaceful atmosphere and historical mosques',
        region_ar: 'منطقة المدينة المنورة',
        region_en: 'Medina Region',
        location_type_ar: 'ديني',
        location_type_en: 'Religious',
        destination_type_ar: 'روحاني',
        destination_type_en: 'Spiritual',
        main_image: '/images/destinations/saudi/Medina/Medina1.jpeg',
        featured: true,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'alula',
        name_ar: 'العلا',
        name_en: 'Al Ula',
        description_ar: 'واحة قديمة تضم الحجر، أول موقع للتراث العالمي في المملكة العربية السعودية، مع مناظر صحراوية خلابة وتشكيلات صخرية',
        description_en: 'Ancient oasis city featuring Hegra, Saudi Arabia\'s first UNESCO World Heritage site, with stunning desert landscapes and rock formations',
        region_ar: 'منطقة المدينة المنورة',
        region_en: 'Medina Region',
        location_type_ar: 'تاريخي',
        location_type_en: 'Historical',
        destination_type_ar: 'ثقافي',
        destination_type_en: 'Cultural',
        main_image: '/images/destinations/saudi/alula/AlUla1.jpeg',
        featured: true,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }
    ]

    const globalDestinations = [
      {
        id: 'barcelona',
        name_ar: 'برشلونة',
        name_en: 'Barcelona',
        description_ar: 'مدينة متوسطية نابضة بالحياة تشتهر بهندستها المعمارية المذهلة وثقافتها الغنية ومزيج فريد من المعالم القوطية والحديثة',
        description_en: 'A vibrant Mediterranean city known for its stunning architecture, rich culture, and the unique blend of Gothic and Modernist landmarks',
        region_ar: 'كتالونيا',
        region_en: 'Catalonia',
        location_type_ar: 'ساحلي',
        location_type_en: 'Coastal',
        destination_type_ar: 'ثقافي',
        destination_type_en: 'Cultural',
        main_image: '/images/destinations/global/Barcelona/Barcelona1.jpeg',
        featured: true,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'cairo',
        name_ar: 'القاهرة',
        name_en: 'Cairo',
        description_ar: 'عاصمة مصر، مدينة يلتقي فيها التاريخ القديم بالحياة العصرية، وموطن آخر عجائب العالم القديم المتبقية',
        description_en: 'The capital of Egypt, a city where ancient history meets modern life, home to the last remaining wonder of the ancient world',
        region_ar: 'محافظة القاهرة',
        region_en: 'Cairo Governorate',
        location_type_ar: 'مدينة',
        location_type_en: 'Urban',
        destination_type_ar: 'تاريخي',
        destination_type_en: 'Historical',
        main_image: '/images/destinations/global/Cairo/Cairo1.jpeg',
        featured: true,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'georgia',
        name_ar: 'جورجيا',
        name_en: 'Georgia',
        description_ar: 'دولة في مفترق طرق أوروبا الشرقية وغرب آسيا، معروفة بمناظرها الطبيعية المتنوعة وتاريخها الغني وثقافة النبيذ الشهيرة',
        description_en: 'A country at the intersection of Eastern Europe and Western Asia, known for its diverse landscapes, rich history, and renowned wine culture',
        region_ar: 'القوقاز',
        region_en: 'Caucasus',
        location_type_ar: 'متنوع',
        location_type_en: 'Diverse',
        destination_type_ar: 'ثقافي',
        destination_type_en: 'Cultural',
        main_image: '/images/destinations/global/Georgia/Georgia1.jpeg',
        featured: false,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'istanbul',
        name_ar: 'إسطنبول',
        name_en: 'Istanbul',
        description_ar: 'حيث يلتقي الشرق بالغرب، مدينة تمتد على قارتين بتاريخ غني',
        description_en: 'Where East meets West, a city straddling two continents with rich history',
        region_ar: 'مرمرة',
        region_en: 'Marmara',
        location_type_ar: 'ساحلي',
        location_type_en: 'Coastal',
        destination_type_ar: 'تاريخي',
        destination_type_en: 'Historical',
        main_image: '/images/destinations/global/Istanbul/Istanbul1.jpeg',
        featured: true,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'london',
        name_ar: 'لندن',
        name_en: 'London',
        description_ar: 'مدينة متنوعة تمزج بين التاريخ والحداثة، معروفة بمعالمها الأيقونية ومتاحفها العالمية ومشهدها الثقافي النابض بالحياة',
        description_en: 'A diverse metropolis blending history and modernity, known for its iconic landmarks, world-class museums, and vibrant cultural scene',
        region_ar: 'لندن الكبرى',
        region_en: 'Greater London',
        location_type_ar: 'مدينة',
        location_type_en: 'Urban',
        destination_type_ar: 'ثقافي',
        destination_type_en: 'Cultural',
        main_image: '/images/destinations/global/London/London1.jpeg',
        featured: true,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'madrid',
        name_ar: 'مدريد',
        name_en: 'Madrid',
        description_ar: 'عاصمة إسبانيا المركزية، مدينة الشوارع الأنيقة والحدائق الواسعة ومتاحف الفن المشهورة عالمياً',
        description_en: 'Spain\'s central capital, a city of elegant boulevards, expansive parks, and world-renowned art museums',
        region_ar: 'مجتمع مدريد',
        region_en: 'Community of Madrid',
        location_type_ar: 'مدينة',
        location_type_en: 'Urban',
        destination_type_ar: 'ثقافي',
        destination_type_en: 'Cultural',
        main_image: '/images/destinations/global/Madrid/Madrid1.jpeg',
        featured: false,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'morocco',
        name_ar: 'المغرب',
        name_en: 'Morocco',
        description_ar: 'دولة في شمال أفريقيا تقدم مزيجاً من التأثيرات الثقافية العربية والأمازيغية والأوروبية، وتتميز بالمدن القديمة والصحاري الخلابة والأسواق النابضة بالحياة',
        description_en: 'A North African country offering a blend of Arab, Berber, and European cultural influences, featuring ancient medinas, stunning deserts, and vibrant markets',
        region_ar: 'شمال أفريقيا',
        region_en: 'North Africa',
        location_type_ar: 'متنوع',
        location_type_en: 'Diverse',
        destination_type_ar: 'ثقافي',
        destination_type_en: 'Cultural',
        main_image: '/images/destinations/global/Morocco/Morocco1.jpeg',
        featured: false,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'paris',
        name_ar: 'باريس',
        name_en: 'Paris',
        description_ar: 'مدينة النور، مركز عالمي للفن والأزياء والطعام والثقافة، مشهورة بمعالمها الأيقونية وأجوائها الرومانسية',
        description_en: 'The City of Light, a global center for art, fashion, gastronomy, and culture, famous for its iconic landmarks and romantic atmosphere',
        region_ar: 'إيل دو فرانس',
        region_en: 'Île-de-France',
        location_type_ar: 'مدينة',
        location_type_en: 'Urban',
        destination_type_ar: 'ثقافي',
        destination_type_en: 'Cultural',
        main_image: '/images/destinations/global/Paris/Paris1.jpeg',
        featured: true,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'sharm-el-sheikh',
        name_ar: 'شرم الشيخ',
        name_en: 'Sharm El Sheikh',
        description_ar: 'جنة ساحلية معروفة بشواطئها النقية والشعاب المرجانية النابضة بالحياة ومواقع الغوص العالمية',
        description_en: 'A coastal paradise known for its pristine beaches, vibrant coral reefs, and world-class diving spots',
        region_ar: 'جنوب سيناء',
        region_en: 'South Sinai',
        location_type_ar: 'ساحلي',
        location_type_en: 'Coastal',
        destination_type_ar: 'شاطئ',
        destination_type_en: 'Beach',
        main_image: '/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg',
        featured: false,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      },
      {
        id: 'thailand',
        name_ar: 'تايلاند',
        name_en: 'Thailand',
        description_ar: 'دولة في جنوب شرق آسيا معروفة بشواطئها الاستوائية والقصور الملكية الفخمة والآثار القديمة والمعابد المزخرفة التي تعرض تماثيل بوذا',
        description_en: 'Southeast Asian country known for tropical beaches, opulent royal palaces, ancient ruins, and ornate temples displaying figures of Buddha',
        region_ar: 'جنوب شرق آسيا',
        region_en: 'Southeast Asia',
        location_type_ar: 'متنوع',
        location_type_en: 'Diverse',
        destination_type_ar: 'ثقافي',
        destination_type_en: 'Cultural',
        main_image: '/images/destinations/global/Thailand/Thailand1.jpeg',
        featured: true,
        status: 'active',
        created_at: '2025-01-01T00:00:00Z',
        updated_at: '2025-01-01T00:00:00Z'
      }
    ]

    // Combine all destinations
    const allDestinations = [...saudiDestinations, ...globalDestinations]

    // Apply filters
    let filteredDestinations = allDestinations

    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase()
      filteredDestinations = filteredDestinations.filter(dest => 
        dest.name_ar.toLowerCase().includes(searchLower) ||
        dest.name_en.toLowerCase().includes(searchLower) ||
        dest.description_ar.toLowerCase().includes(searchLower) ||
        dest.description_en.toLowerCase().includes(searchLower) ||
        dest.region_ar.toLowerCase().includes(searchLower) ||
        dest.region_en.toLowerCase().includes(searchLower)
      )
    }

    if (status) {
      filteredDestinations = filteredDestinations.filter(dest => dest.status === status)
    }

    if (type) {
      filteredDestinations = filteredDestinations.filter(dest => dest.destination_type_ar === type)
    }

    if (featured) {
      filteredDestinations = filteredDestinations.filter(dest => dest.featured === (featured === 'true'))
    }

    // Apply pagination
    const pageNum = Number(page)
    const limitNum = Number(limit)
    const from = (pageNum - 1) * limitNum
    const to = from + limitNum
    const paginatedDestinations = filteredDestinations.slice(from, to)

    console.log('Destinations fetched successfully:', paginatedDestinations.length)

    return {
      destinations: paginatedDestinations,
      total: filteredDestinations.length,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(filteredDestinations.length / limitNum)
    }
  } catch (error) {
    console.error('Destinations fetch error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch destinations'
    })
  }
})
