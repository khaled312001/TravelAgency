import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ueofktshvaqtxjsxvisv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA'

const supabase = createClient(supabaseUrl, supabaseKey)

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    if (!body || typeof body !== 'object') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid request body'
      })
    }

    // Prepare settings for database update in seo_settings table
    const settingsUpdate = {
      page: 'settings',
      title_ar: 'إعدادات الموقع',
      title_en: 'Website Settings',
      description_ar: JSON.stringify({
        site_name: body.general?.siteName || { ar: 'وكالة أرض العجائب للسفر', en: 'World Trip Agency Traveling Agency' },
        site_description: body.general?.siteDescription || { ar: 'وكالة سفر متخصصة في تنظيم الرحلات السياحية', en: 'Specialized travel agency for organizing tourist trips' },
        site_url: body.general?.siteUrl || 'https://www.worldtripagency.com',
        contact_email: body.general?.contactEmail || 'info@worldtripagency.com',
        contact_email2: body.general?.contactEmail2 || 'support@worldtripagency.com',
        contact_phone: body.general?.contactPhone || '+966500982394',
        contact_phone2: body.general?.contactPhone2 || '+966112345678',
        contact_address: body.general?.contactAddress || { ar: 'مكة المكرمة  - شارع الستين ', en: 'Riyadh, Saudi Arabia' },
        contact_hours: body.general?.contactHours || { ar: 'السبت - الخميس: 8:00 ص - 6:00 م', en: 'Saturday - Thursday: 8:00 AM - 6:00 PM' },
        whatsapp_url: body.general?.whatsappUrl || 'https://wa.me/966500982394',
        instagram_url: body.general?.instagramUrl || 'https://instagram.com/worldtripagency',
        facebook_url: body.general?.facebookUrl || 'https://facebook.com/worldtripagency',
        twitter_url: body.general?.twitterUrl || 'https://twitter.com/worldtripagency',
        snapchat_url: body.general?.snapchatUrl || 'https://www.snapchat.com/add/ahmed18311',
        tiktok_url: body.general?.tiktokUrl || 'https://www.tiktok.com/@wonder.land.sa',
        license_number: body.general?.licenseNumber || '73105863',
        registration_number: body.general?.registrationNumber || '7043491153',
        iata_number: body.general?.iataNumber || '',
        insurance_info: body.general?.insuranceInfo || '',
        destination1: body.general?.destination1 || 'الرياض',
        destination2: body.general?.destination2 || 'البحر الأحمر',
        destination3: body.general?.destination3 || 'العلا'
      }),
      description_en: JSON.stringify({
        main_logo: body.logo?.mainLogo || '/images/home/logo/WonderlandLogo.svg',
        footer_logo: body.logo?.footerLogo || '/images/home/logo/WonderlandLogoWhite.svg',
        favicon: body.logo?.favicon || '/favicon.ico',
        logo_height: body.logo?.logoHeight || 48,
        show_logo_text: body.logo?.showLogoText ?? true,
        logo_text: body.logo?.logoText || { ar: 'أرض العجائب', en: 'World Trip Agency' }
      }),
      keywords_ar: JSON.stringify({
        smtp_host: body.email?.smtpHost || '',
        smtp_port: body.email?.smtpPort || 587,
        smtp_username: body.email?.smtpUsername || '',
        smtp_password: body.email?.smtpPassword || '',
        from_email: body.email?.fromEmail || 'noreply@worldtripagency.com',
        from_name: body.email?.fromName || { ar: 'وكالة أرض العجائب للسفر', en: 'World Trip Agency Traveling Agency' }
      }),
      keywords_en: JSON.stringify({
        stripe_enabled: body.payment?.stripeEnabled || false,
        stripe_public_key: body.payment?.stripePublicKey || '',
        stripe_secret_key: body.payment?.stripeSecretKey || '',
        mada_enabled: body.payment?.madaEnabled || true,
        visa_enabled: body.payment?.visaEnabled || true,
        mastercard_enabled: body.payment?.mastercardEnabled || true
      })
    }

    // Update settings in seo_settings table
    const { error } = await supabase
      .from('seo_settings')
      .upsert(settingsUpdate, { onConflict: 'page' })

    if (error) {
      console.error('Error updating settings:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to update settings'
      })
    }

    return {
      success: true,
      message: 'Settings updated successfully'
    }
  } catch (error) {
    console.error('Error updating settings:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
