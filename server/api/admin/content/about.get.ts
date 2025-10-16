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

    console.log('About content fetch result:', { data, error })

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
        },
        cta_title: {
          ar: 'هل أنت مهتم بمعرفة المزيد عن باقاتنا؟',
          en: 'Are you interested in learning more about our packages?'
        },
        cta: {
          ar: 'استكشف باقاتنا',
          en: 'Explore Our Packages'
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
        },
        why_us: {
          ar: 'لماذا نحن؟',
          en: 'Why Us?'
        },
        closing: {
          ar: 'نؤمن بأن السفر ليس مجرد رحلة - إنه تجربة تُذكر. نسعى جاهدين لملء كل رحلة بلحظات سعيدة وذكريات جميلة.',
          en: 'We believe that travel is not just a journey - it\'s an experience to remember. We strive to fill every trip with happy moments and beautiful memories.'
        },
        benefits: [
          { 
            ar: 'أسعار لا تُقاوم: نقدم أفضل العروض على تذاكر الطيران والفنادق بأقل الأسعار دون المساس بالجودة.',
            en: 'Irresistible Prices: We offer the best deals on flights and hotels at the lowest prices without compromising quality.'
          },
          { 
            ar: 'خيارات حجز مخصصة: سواء كنت تفضل خيارات فاخرة أو اقتصادية، لدينا الخيارات المثالية لتلبية احتياجاتك.',
            en: 'Customized Booking Options: Whether you prefer luxury or budget options, we have the perfect choices to meet your needs.'
          },
          { 
            ar: 'خدمات تأشيرة سريعة: نساعدك في الحصول على التأشيرات بسرعة وسهولة، بغض النظر عن وجهتك.',
            en: 'Fast Visa Services: We help you get visas quickly and easily, regardless of your destination.'
          },
          { 
            ar: 'تأمين سفر شامل: استمتع براحة البال في رحلتك مع تغطية التأمين الشاملة.',
            en: 'Comprehensive Travel Insurance: Enjoy peace of mind on your trip with comprehensive insurance coverage.'
          },
          { 
            ar: 'رخصة قيادة دولية: احصل على حرية القيادة في الخارج بثقة مع رخصة القيادة الدولية المعترف بها.',
            en: 'International Driving License: Get the freedom to drive abroad with confidence with a recognized international driving license.'
          },
          { 
            ar: 'خدمة عملاء على مدار الساعة: فريقنا المخصص متاح دائمًا لمساعدتك، في أي وقت وفي أي مكان.',
            en: '24/7 Customer Service: Our dedicated team is always available to help you, anytime, anywhere.'
          }
        ],
        reasons: [
          { 
            ar: 'خبرة واسعة في صناعة السفر',
            en: 'Extensive experience in the travel industry'
          },
          { 
            ar: 'دعم عملاء ممتاز على مدار الساعة',
            en: 'Excellent 24/7 customer support'
          },
          { 
            ar: 'باقات سفر وعروض تنافسية',
            en: 'Competitive travel packages and offers'
          },
          { 
            ar: 'شراكات مع أفضل الفنادق وشركات الطيران',
            en: 'Partnerships with top hotels and airlines'
          }
        ]
      },
      mission: {
        title: {
          ar: 'مهمتنا ورؤيتنا',
          en: 'Our Mission & Vision'
        },
        subtitle: {
          ar: 'مسترشدين بالتزامنا بالتميز ورضا العملاء',
          en: 'Guided by our commitment to excellence and customer satisfaction'
        },
        mission_title: {
          ar: 'مهمتنا',
          en: 'Our Mission'
        },
        mission_text: {
          ar: 'تقديم تجارب سفر استثنائية تفوق توقعات عملائنا من خلال خدمة شخصية، والاهتمام بالتفاصيل، وحلول سفر شاملة.',
          en: 'To deliver exceptional travel experiences that exceed our customers\' expectations through personalized service, attention to detail, and comprehensive travel solutions.'
        },
        vision_title: {
          ar: 'رؤيتنا',
          en: 'Our Vision'
        },
        vision_text: {
          ar: 'أن نصبح وكالة السفر الرائدة المعروفة بتحويل الرحلات العادية إلى رحلات استثنائية، وخلق ذكريات تدوم مدى الحياة لعملائنا حول العالم.',
          en: 'To become the leading travel agency known for transforming ordinary trips into extraordinary journeys, creating lifelong memories for our customers around the world.'
        }
      },
      values: {
        title: {
          ar: 'قيمنا الأساسية',
          en: 'Our Core Values'
        },
        subtitle: {
          ar: 'المبادئ التي توجه كل ما نقوم به',
          en: 'The principles that guide everything we do'
        },
        items: [
          {
            title: { ar: 'التميز', en: 'Excellence' },
            description: { 
              ar: 'نسعى للتميز في كل جانب من جوانب خدمتنا، من الاستفسار الأول حتى اليوم الأخير من رحلتك.',
              en: 'We strive for excellence in every aspect of our service, from the first inquiry to the last day of your trip.'
            }
          },
          {
            title: { ar: 'النزاهة', en: 'Integrity' },
            description: { 
              ar: 'نعمل بشفافية وأمانة كاملة، مما يضمن ثقة عملائنا بنا في كل خطوة من الطريق.',
              en: 'We operate with complete transparency and honesty, ensuring our customers trust us every step of the way.'
            }
          },
          {
            title: { ar: 'الابتكار', en: 'Innovation' },
            description: { 
              ar: 'نبحث باستمرار عن طرق جديدة وأفضل لتعزيز تجربة السفر من خلال التكنولوجيا والحلول الإبداعية.',
              en: 'We continuously seek new and better ways to enhance the travel experience through technology and creative solutions.'
            }
          },
          {
            title: { ar: 'التخصيص', en: 'Personalization' },
            description: { 
              ar: 'ندرك أن كل مسافر فريد من نوعه، ونقوم بتخصيص خدماتنا لتلبية الاحتياجات والتفضيلات الفردية.',
              en: 'We recognize that every traveler is unique, and we customize our services to meet individual needs and preferences.'
            }
          },
          {
            title: { ar: 'الاستدامة', en: 'Sustainability' },
            description: { 
              ar: 'نلتزم بممارسات سفر مسؤولة تحترم وتحافظ على الوجهات للأجيال القادمة.',
              en: 'We are committed to responsible travel practices that respect and preserve destinations for future generations.'
            }
          },
          {
            title: { ar: 'الشراكة', en: 'Partnership' },
            description: { 
              ar: 'نبني علاقات قوية مع عملائنا وموردينا والمجتمعات لخلق قيمة ونجاح متبادل.',
              en: 'We build strong relationships with our customers, suppliers, and communities to create mutual value and success.'
            }
          }
        ]
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
