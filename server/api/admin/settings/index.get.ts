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
          contactAddress: { ar: 'مكة المكرمة  - شارع الستين ', en: 'Riyadh, Saudi Arabia' }
        },
        logo: {
          mainLogo: '/images/home/logo/WonderlandLogo.svg',
          footerLogo: '/images/home/logo/WonderlandLogoWhite.svg',
          favicon: '/favicon.ico',
          logoHeight: 48,
          showLogoText: true,
          logoText: { ar: 'أرض العجائب', en: 'World Trip Agency' }
        },
        email: {
          smtpHost: '',
          smtpPort: 587,
          smtpUsername: '',
          smtpPassword: '',
          fromEmail: 'noreply@worldtripagency.com',
          fromName: { ar: 'وكالة أرض العجائب للسفر', en: 'World Trip Agency Traveling Agency' }
        },
        payment: {
          stripeEnabled: false,
          stripePublicKey: '',
          stripeSecretKey: '',
          madaEnabled: true,
          visaEnabled: true,
          mastercardEnabled: true
        },
        seo: {
          metaTitle: { ar: 'أرض العجائب - وكالة سفر متخصصة', en: 'World Trip Agency - Specialized Travel Agency' },
          metaDescription: { ar: 'وكالة سفر متخصصة في تنظيم الرحلات السياحية والعمرة والحج', en: 'Specialized travel agency for organizing tourist trips, Umrah and Hajj' },
          metaKeywords: { ar: 'سفر, رحلات, عمرة, حج, سياحة', en: 'travel, trips, umrah, hajj, tourism' },
          googleAnalyticsId: '',
          googleSearchConsole: ''
        },
        security: {
          sessionTimeout: 24,
          requireStrongPassword: true,
          enableTwoFactor: false,
          enableRateLimit: true
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
    let emailSettings = {}
    let paymentSettings = {}
    
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
    
    try {
      emailSettings = JSON.parse(settings.keywords_ar || '{}')
    } catch (error) {
      console.error('Error parsing email settings:', error)
      emailSettings = {}
    }
    
    try {
      paymentSettings = JSON.parse(settings.keywords_en || '{}')
    } catch (error) {
      console.error('Error parsing payment settings:', error)
      paymentSettings = {}
    }

    // Transform settings into organized structure
    const organizedSettings = {
      general: {
        siteName: typeof generalSettings.site_name === 'string' 
          ? { ar: generalSettings.site_name, en: generalSettings.site_name }
          : generalSettings.site_name || { ar: 'وكالة أرض العجائب للسفر', en: 'World Trip Agency Traveling Agency' },
        siteDescription: typeof generalSettings.site_description === 'string' 
          ? { ar: generalSettings.site_description, en: generalSettings.site_description }
          : generalSettings.site_description || { ar: 'وكالة سفر متخصصة في تنظيم الرحلات السياحية', en: 'Specialized travel agency for organizing tourist trips' },
        siteUrl: generalSettings.site_url || 'https://www.worldtripagency.com',
        contactEmail: generalSettings.contact_email || 'info@worldtripagency.com',
        contactEmail2: generalSettings.contact_email2 || 'support@worldtripagency.com',
        contactPhone: generalSettings.contact_phone || '+966500982394',
        contactPhone2: generalSettings.contact_phone2 || '+966112345678',
        contactAddress: typeof generalSettings.contact_address === 'string' 
          ? { ar: generalSettings.contact_address, en: generalSettings.contact_address }
          : generalSettings.contact_address || { ar: 'مكة المكرمة  - شارع الستين ', en: 'Riyadh, Saudi Arabia' },
        contactHours: typeof generalSettings.contact_hours === 'string' 
          ? { ar: generalSettings.contact_hours, en: generalSettings.contact_hours }
          : generalSettings.contact_hours || { ar: 'السبت - الخميس: 8:00 ص - 6:00 م', en: 'Saturday - Thursday: 8:00 AM - 6:00 PM' },
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
        showLogoText: logoSettings.show_logo_text ?? true,
        logoText: typeof logoSettings.logo_text === 'string' 
          ? { ar: logoSettings.logo_text, en: logoSettings.logo_text }
          : logoSettings.logo_text || { ar: 'أرض العجائب', en: 'World Trip Agency' }
      },
      email: {
        smtpHost: emailSettings.smtp_host || '',
        smtpPort: emailSettings.smtp_port || 587,
        smtpUsername: emailSettings.smtp_username || '',
        smtpPassword: emailSettings.smtp_password || '',
        fromEmail: emailSettings.from_email || 'noreply@worldtripagency.com',
        fromName: emailSettings.from_name || { ar: 'وكالة أرض العجائب للسفر', en: 'World Trip Agency Traveling Agency' }
      },
      payment: {
        stripeEnabled: paymentSettings.stripe_enabled || false,
        stripePublicKey: paymentSettings.stripe_public_key || '',
        stripeSecretKey: paymentSettings.stripe_secret_key || '',
        madaEnabled: paymentSettings.mada_enabled || true,
        visaEnabled: paymentSettings.visa_enabled || true,
        mastercardEnabled: paymentSettings.mastercard_enabled || true
      },
      seo: {
        metaTitle: { ar: 'أرض العجائب - وكالة سفر متخصصة', en: 'World Trip Agency - Specialized Travel Agency' },
        metaDescription: { ar: 'وكالة سفر متخصصة في تنظيم الرحلات السياحية والعمرة والحج', en: 'Specialized travel agency for organizing tourist trips, Umrah and Hajj' },
        metaKeywords: { ar: 'سفر, رحلات, عمرة, حج, سياحة', en: 'travel, trips, umrah, hajj, tourism' },
        googleAnalyticsId: '',
        googleSearchConsole: ''
      },
      security: {
        sessionTimeout: 24,
        requireStrongPassword: true,
        enableTwoFactor: false,
        enableRateLimit: true
      }
    }

    return {
      success: true,
      data: organizedSettings
    }
  } catch (error) {
    console.error('Error fetching settings:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})

