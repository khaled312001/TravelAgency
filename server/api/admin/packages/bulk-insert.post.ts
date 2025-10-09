import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'
const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {

    // البكجات الجديدة
    const newPackages = [
      // البكجات الدولية
      {
        title_ar: 'رحلة باريس الرومانسية',
        title_en: 'Romantic Paris Trip',
        description_ar: 'رحلة رومانسية لمدينة النور تشمل زيارة برج إيفل وقصر فرساي واللوفر مع إقامة في فندق فاخر',
        description_en: 'Romantic trip to the City of Light including Eiffel Tower, Versailles Palace, and Louvre with luxury hotel accommodation',
        price: 3500.00,
        duration_days: 5,
        max_persons: 2,
        featured: true,
        travel_period: 'Spring',
        image_url: '/images/packages/destinations/paris-romantic.jpeg',
        status: 'active',
        category: 'international'
      },
      {
        title_ar: 'جولة لندن الكلاسيكية',
        title_en: 'Classic London Tour',
        description_ar: 'جولة شاملة في عاصمة بريطانيا تشمل زيارة قصر باكنغهام وبرج لندن وجسر لندن مع جولات في المتاحف الشهيرة',
        description_en: 'Comprehensive tour of the British capital including Buckingham Palace, Tower of London, and London Bridge with visits to famous museums',
        price: 4200.00,
        duration_days: 7,
        max_persons: 4,
        featured: true,
        travel_period: 'Summer',
        image_url: '/images/packages/destinations/london-classic.jpeg',
        status: 'active',
        category: 'international'
      },
      {
        title_ar: 'رحلة اسطنبول التاريخية',
        title_en: 'Historical Istanbul Journey',
        description_ar: 'اكتشف جمال اسطنبول التاريخية مع زيارة آيا صوفيا والمسجد الأزرق وقصر توبكابي مع رحلات بحرية في البوسفور',
        description_en: 'Discover the historical beauty of Istanbul with visits to Hagia Sophia, Blue Mosque, and Topkapi Palace with Bosphorus cruises',
        price: 2800.00,
        duration_days: 6,
        max_persons: 6,
        featured: true,
        travel_period: 'Spring',
        image_url: '/images/packages/destinations/istanbul-historical.jpeg',
        status: 'active',
        category: 'international'
      },
      {
        title_ar: 'مغامرة تايلاند الاستوائية',
        title_en: 'Tropical Thailand Adventure',
        description_ar: 'مغامرة استوائية في تايلاند تشمل بانكوك وشاطئ باتايا مع جولات في المعابد الذهبية والغابات الاستوائية',
        description_en: 'Tropical adventure in Thailand including Bangkok and Pattaya Beach with tours of golden temples and tropical forests',
        price: 3200.00,
        duration_days: 8,
        max_persons: 4,
        featured: true,
        travel_period: 'Winter',
        image_url: '/images/packages/destinations/thailand-adventure.jpeg',
        status: 'active',
        category: 'international'
      },
      {
        title_ar: 'رحلة المغرب الثقافية',
        title_en: 'Cultural Morocco Trip',
        description_ar: 'رحلة ثقافية غنية في المغرب تشمل مراكش وفاس مع زيارة الأسواق التقليدية والمدن القديمة',
        description_en: 'Rich cultural trip to Morocco including Marrakech and Fez with visits to traditional markets and ancient cities',
        price: 2900.00,
        duration_days: 7,
        max_persons: 4,
        featured: true,
        travel_period: 'Spring',
        image_url: '/images/packages/destinations/morocco-cultural.jpeg',
        status: 'active',
        category: 'international'
      },
      {
        title_ar: 'مغامرة شرم الشيخ الغوص',
        title_en: 'Sharm El Sheikh Diving Adventure',
        description_ar: 'مغامرة غوص في شرم الشيخ مع رحلات بحرية في البحر الأحمر واستكشاف الشعاب المرجانية الملونة',
        description_en: 'Diving adventure in Sharm El Sheikh with Red Sea cruises and exploration of colorful coral reefs',
        price: 2500.00,
        duration_days: 6,
        max_persons: 4,
        featured: true,
        travel_period: 'Summer',
        image_url: '/images/packages/destinations/sharm-diving.jpeg',
        status: 'active',
        category: 'international'
      },
      {
        title_ar: 'رحلة جورجيا الجبلية',
        title_en: 'Mountain Georgia Trip',
        description_ar: 'رحلة جبلية في جورجيا تشمل تبليسي وبحيرة ريتسا مع جولات في القرى الجبلية التقليدية',
        description_en: 'Mountain trip to Georgia including Tbilisi and Lake Ritsa with tours of traditional mountain villages',
        price: 2200.00,
        duration_days: 5,
        max_persons: 4,
        featured: true,
        travel_period: 'Summer',
        image_url: '/images/packages/destinations/georgia-mountain.jpeg',
        status: 'active',
        category: 'international'
      },
      {
        title_ar: 'جولة برشلونة الفنية',
        title_en: 'Artistic Barcelona Tour',
        description_ar: 'جولة فنية في برشلونة تشمل أعمال غاودي ومتحف بيكاسو مع جولات في الحي القوطي القديم',
        description_en: 'Artistic tour of Barcelona including Gaudi works and Picasso Museum with tours of the old Gothic Quarter',
        price: 3800.00,
        duration_days: 6,
        max_persons: 4,
        featured: true,
        travel_period: 'Spring',
        image_url: '/images/packages/destinations/barcelona-artistic.jpeg',
        status: 'active',
        category: 'international'
      },
      {
        title_ar: 'رحلة مدريد الملكية',
        title_en: 'Royal Madrid Trip',
        description_ar: 'رحلة ملكية في مدريد تشمل قصر ريال مدريد ومتحف برادو مع جولات في الساحات التاريخية',
        description_en: 'Royal trip to Madrid including Royal Palace and Prado Museum with tours of historical squares',
        price: 3600.00,
        duration_days: 5,
        max_persons: 4,
        featured: true,
        travel_period: 'Autumn',
        image_url: '/images/packages/destinations/madrid-royal.jpeg',
        status: 'active',
        category: 'international'
      },
      // البكجات السعودية
      {
        title_ar: 'جولة الرياض التراثية',
        title_en: 'Heritage Riyadh Tour',
        description_ar: 'جولة تراثية في الرياض تشمل البلدة القديمة ومتحف الملك عبدالعزيز مع زيارة قصر المصمك التاريخي',
        description_en: 'Heritage tour of Riyadh including the old town and King Abdulaziz Museum with a visit to the historic Masmak Palace',
        price: 1500.00,
        duration_days: 3,
        max_persons: 6,
        featured: true,
        travel_period: 'Winter',
        image_url: '/images/packages/destinations/riyadh-heritage.jpeg',
        status: 'active',
        category: 'domestic'
      },
      {
        title_ar: 'رحلة العلا الأثرية',
        title_en: 'Archaeological AlUla Trip',
        description_ar: 'رحلة أثرية في العلا تشمل مدائن صالح والجبل الأحمر مع جولات في المواقع الأثرية القديمة',
        description_en: 'Archaeological trip to AlUla including Madain Saleh and Red Mountain with tours of ancient archaeological sites',
        price: 1800.00,
        duration_days: 4,
        max_persons: 4,
        featured: true,
        travel_period: 'Winter',
        image_url: '/images/packages/destinations/alula-archaeological.jpeg',
        status: 'active',
        category: 'domestic'
      },
      {
        title_ar: 'رحلة جدة الساحلية',
        title_en: 'Coastal Jeddah Trip',
        description_ar: 'رحلة ساحلية في جدة تشمل الكورنيش والبلدة القديمة مع جولات في الأسواق التقليدية والمطاعم الشعبية',
        description_en: 'Coastal trip to Jeddah including the Corniche and old town with tours of traditional markets and popular restaurants',
        price: 1200.00,
        duration_days: 3,
        max_persons: 6,
        featured: true,
        travel_period: 'Summer',
        image_url: '/images/packages/destinations/jeddah-coastal.jpeg',
        status: 'active',
        category: 'domestic'
      }
    ]

    // إدراج البكجات
    const { data: packagesData, error: packagesError } = await supabase
      .from('packages')
      .insert(newPackages)
      .select()

    if (packagesError) {
      throw createError({
        statusCode: 400,
        statusMessage: packagesError.message
      })
    }

    // إضافة خيارات البكجات
    const packageOptions = packagesData.map(pkg => ({
      package_id: pkg.id,
      flight: pkg.category === 'international',
      hotel: true,
      transportation: pkg.category === 'international',
      hotel_grade: pkg.price >= 3000 ? 5 : pkg.price >= 2000 ? 4 : 3
    }))

    const { error: optionsError } = await supabase
      .from('package_options')
      .insert(packageOptions)

    if (optionsError) {
      console.warn('Failed to create package options:', optionsError.message)
    }

    return {
      success: true,
      message: 'تم إضافة 12 باقة جديدة بنجاح',
      packages: packagesData,
      totalAdded: packagesData.length
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to add packages'
    })
  }
})
