import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    // Get settings from seo_settings table
    const { data: settings, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page', 'settings')
      .single()

    // If no settings record exists, return default settings
    if (error || !settings) {
      console.log('No settings record found, returning default settings')
      const defaultSettings = {
        general: {
          siteName: { ar: 'وكالة أرض العجائب للسفر', en: 'World Trip Agency Traveling Agency' },
          siteDescription: { ar: 'وكالة سفر متخصصة في تنظيم الرحلات السياحية', en: 'Specialized travel agency for organizing tourist trips' },
          siteUrl: 'https://www.worldtripagency.com',
          contactEmail: 'info@worldtripagency.com',
          contactPhone: '+966500982394',
          contactAddress: { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' }
        },
        logo: {
          mainLogo: '/images/home/logo/WonderlandLogo.svg',
          footerLogo: '/images/home/logo/WonderlandLogoWhite.svg',
          favicon: '/favicon.ico',
          logoHeight: 48,
          showLogoText: true,
          logoText: { ar: 'أرض العجائب', en: 'World Trip Agency' }
        },
        seo: {
          metaTitle: { ar: 'أرض العجائب - وكالة سفر متخصصة', en: 'World Trip Agency - Specialized Travel Agency' },
          metaDescription: { ar: 'وكالة سفر متخصصة في تنظيم الرحلات السياحية والعمرة والحج', en: 'Specialized travel agency for organizing tourist trips, Umrah and Hajj' },
          metaKeywords: { ar: 'سفر, رحلات, عمرة, حج, سياحة', en: 'travel, trips, umrah, hajj, tourism' },
          googleAnalyticsId: '',
          googleSearchConsole: ''
        }
      }

      return {
        success: true,
        data: defaultSettings
      }
    }

    // Parse JSON data from the settings record with error handling
    let generalSettings = {}
    let logoSettings = {}
    
    try {
      generalSettings = JSON.parse(settings.description_ar || '{}')
    } catch (error) {
      console.error('Error parsing general settings:', error)
      generalSettings = {}
    }
    
    try {
      logoSettings = JSON.parse(settings.description_en || '{}')
    } catch (error) {
      console.error('Error parsing logo settings:', error)
      logoSettings = {}
    }

    // Transform settings into organized structure (public only)
    const publicSettings = {
      general: {
        siteName: generalSettings.site_name || { ar: 'وكالة أرض العجائب للسفر', en: 'World Trip Agency Traveling Agency' },
        siteDescription: generalSettings.site_description || { ar: 'وكالة سفر متخصصة في تنظيم الرحلات السياحية', en: 'Specialized travel agency for organizing tourist trips' },
        siteUrl: generalSettings.site_url || 'https://www.worldtripagency.com',
        contactEmail: generalSettings.contact_email || 'info@worldtripagency.com',
        contactEmail2: generalSettings.contact_email2 || 'support@worldtripagency.com',
        contactPhone: generalSettings.contact_phone || '+966500982394',
        contactPhone2: generalSettings.contact_phone2 || '+966112345678',
        contactAddress: typeof generalSettings.contact_address === 'string' 
          ? { ar: generalSettings.contact_address, en: generalSettings.contact_address }
          : generalSettings.contact_address || { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' },
        contactHours: generalSettings.contact_hours || 'السبت - الخميس: 8:00 ص - 6:00 م',
        contactHoursEn: generalSettings.contact_hours_en || 'Saturday - Thursday: 8:00 AM - 6:00 PM',
        whatsappUrl: generalSettings.whatsapp_url || 'https://wa.me/966500982394',
        instagramUrl: generalSettings.instagram_url || 'https://instagram.com/worldtripagency',
        facebookUrl: generalSettings.facebook_url || 'https://facebook.com/worldtripagency',
        twitterUrl: generalSettings.twitter_url || 'https://twitter.com/worldtripagency',
        snapchatUrl: generalSettings.snapchat_url || 'https://www.snapchat.com/add/ahmed18311',
        tiktokUrl: generalSettings.tiktok_url || 'https://www.tiktok.com/@wonder.land.sa',
        licenseNumber: generalSettings.license_number || '73105863',
        registrationNumber: generalSettings.registration_number || '7043491153',
        iataNumber: generalSettings.iata_number || '',
        insuranceInfo: generalSettings.insurance_info || '',
        destination1: generalSettings.destination1 || 'الرياض',
        destination2: generalSettings.destination2 || 'البحر الأحمر',
        destination3: generalSettings.destination3 || 'العلا'
      },
      logo: {
        mainLogo: logoSettings.main_logo || '/images/home/logo/WonderlandLogo.svg',
        footerLogo: logoSettings.footer_logo || '/images/home/logo/WonderlandLogoWhite.svg',
        favicon: logoSettings.favicon || '/favicon.ico',
        logoHeight: logoSettings.logo_height || 48,
        showLogoText: logoSettings.show_logo_text || true,
        logoText: logoSettings.logo_text || { ar: 'أرض العجائب', en: 'World Trip Agency' }
      },
      seo: {
        metaTitle: { ar: 'أرض العجائب - وكالة سفر متخصصة', en: 'World Trip Agency - Specialized Travel Agency' },
        metaDescription: { ar: 'وكالة سفر متخصصة في تنظيم الرحلات السياحية والعمرة والحج', en: 'Specialized travel agency for organizing tourist trips, Umrah and Hajj' },
        metaKeywords: { ar: 'سفر, رحلات, عمرة, حج, سياحة', en: 'travel, trips, umrah, hajj, tourism' },
        googleAnalyticsId: '',
        googleSearchConsole: ''
      }
    }

    return {
      success: true,
      data: publicSettings
    }
  } catch (error) {
    console.error('Error fetching public settings:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

