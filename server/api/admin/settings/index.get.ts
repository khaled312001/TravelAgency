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
    const emailSettings = JSON.parse(settings.keywords_ar || '{}')
    const paymentSettings = JSON.parse(settings.keywords_en || '{}')

    // Transform settings into organized structure
    const organizedSettings = {
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
      email: {
        smtpHost: emailSettings.smtp_host || '',
        smtpPort: emailSettings.smtp_port || 587,
        smtpUsername: emailSettings.smtp_username || '',
        smtpPassword: emailSettings.smtp_password || '',
        fromEmail: emailSettings.from_email || 'noreply@worldtripagency.com',
        fromName: emailSettings.from_name || { ar: 'وكالة أرض العجائب للسفر', en: 'Wonder Land Traveling Agency' }
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
        metaTitle: { ar: 'أرض العجائب - وكالة سفر متخصصة', en: 'Wonder Land - Specialized Travel Agency' },
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

