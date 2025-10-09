import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    // Get settings from seo_settings table
    const { data: settings, error } = await supabase
      .from('seo_settings')
      .select('*')
      .eq('page', 'settings')
      .single()

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch settings'
      })
    }

    // Parse JSON data from the settings record
    const generalSettings = JSON.parse(settings.description_ar || '{}')
    const logoSettings = JSON.parse(settings.description_en || '{}')

    // Transform settings into organized structure (public only)
    const publicSettings = {
      general: {
        siteName: generalSettings.site_name || { ar: 'وكالة أرض العجائب للسفر', en: 'Wonder Land Traveling Agency' },
        siteDescription: generalSettings.site_description || { ar: 'وكالة سفر متخصصة في تنظيم الرحلات السياحية', en: 'Specialized travel agency for organizing tourist trips' },
        siteUrl: generalSettings.site_url || 'https://www.worldtripagency.com',
        contactEmail: generalSettings.contact_email || 'info@worldtripagency.com',
        contactPhone: generalSettings.contact_phone || '+966500982394',
        contactAddress: generalSettings.contact_address || { ar: 'الرياض، المملكة العربية السعودية', en: 'Riyadh, Saudi Arabia' }
      },
      logo: {
        mainLogo: logoSettings.main_logo || '/images/home/logo/WonderlandLogo.svg',
        footerLogo: logoSettings.footer_logo || '/images/home/logo/WonderlandLogoWhite.svg',
        favicon: logoSettings.favicon || '/favicon.ico',
        logoHeight: logoSettings.logo_height || 48,
        showLogoText: logoSettings.show_logo_text || true,
        logoText: logoSettings.logo_text || { ar: 'أرض العجائب', en: 'Wonder Land' }
      },
      seo: {
        metaTitle: { ar: 'أرض العجائب - وكالة سفر متخصصة', en: 'Wonder Land - Specialized Travel Agency' },
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

