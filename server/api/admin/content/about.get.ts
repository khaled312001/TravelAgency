import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://ueofktshvaqtxjsxvisv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0'
)

export default defineEventHandler(async (event) => {
  try {
    // Set proper headers for UTF-8 encoding
    setHeader(event, 'Content-Type', 'application/json; charset=utf-8')
    
    // Get about page content from site_content table
    const { data, error } = await supabase
      .from('site_content')
      .select('content')
      .eq('page', 'about')
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching about content:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch about content'
      })
    }

    // Return default content if no data found
    const defaultContent = {
      hero: {
        title: { 
          ar: 'شريكك الموثوق به لتجارب سفر استثنائية منذ عام 2019',
          en: 'Your Trusted Partner for Exceptional Travel Experiences Since 2019'
        },
        subtitle: { 
          ar: 'اكتشف تجربة السفر مع World Trip Agency - حيث تتحول كل رحلة إلى مغامرة لا تُنسى',
          en: 'Discover the travel experience with World Trip Agency – where every journey transforms into an unforgettable adventure'
        }
      },
      overview: {
        title: { 
          ar: 'World Trip Agency للسفر والسياحة',
          en: 'World Trip Agency Travel & Tourism'
        },
        intro: { 
          ar: 'هل تبحث عن تجربة سفر لا تُنسى بأسعار لا تُقاوم؟ World Trip Agency هي بوابتك إلى عالم مليء بالمغامرات والرفاهية، حيث نقدم أفضل العروض وأعلى مستويات الخدمة!',
          en: 'Are you looking for an unforgettable travel experience at irresistible prices? World Trip Agency is your gateway to a world filled with adventures and luxury, where we offer the best deals and the highest level of service!'
        },
        why_choose_us: { 
          ar: 'لماذا تختار World Trip Agency؟',
          en: 'Why Choose World Trip Agency?'
        },
        about_title: { 
          ar: 'عن World Trip Agency للسفر والسياحة',
          en: 'About World Trip Agency Travel & Tourism'
        },
        about_text: { 
          ar: 'تأسست World Trip Agency للسفر والسياحة في عام 2019، لتكون بوابتك إلى رحلات فريدة وتجارب سفر استثنائية. نحن متخصصون في تقديم خدمات سفر شاملة تضمن تجربة سلسة ومريحة لكل مسافر - سواء كانت إجازات عائلية، أو جولات فاخرة، أو استكشافات مغامرة.',
          en: 'World Trip Agency Travel & Tourism was established in 2019 as your gateway to unique trips and exceptional travel experiences. We specialize in offering comprehensive travel services that ensure a seamless and comfortable experience for every traveler – whether it\'s family vacations, luxury tours, or adventurous explorations.'
        }
      }
    }

    return {
      success: true,
      data: data?.content || defaultContent
    }
  } catch (error: any) {
    console.error('Error in about content fetch:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
