-- Create settings table for storing website settings
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(255) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (key, value, category, description) VALUES
-- General Settings
('site_name', '{"en": "World Trip Agency Traveling Agency", "ar": "وكالة أرض العجائب للسفر"}', 'general', 'Website name in multiple languages'),
('site_description', '{"en": "Specialized travel agency for organizing tourist trips", "ar": "وكالة سفر متخصصة في تنظيم الرحلات السياحية"}', 'general', 'Website description'),
('site_url', '"https://www.worldtripagency.com"', 'general', 'Website URL'),
('contact_email', '"info@worldtripagency.com"', 'general', 'Contact email'),
('contact_phone', '"+966500982394"', 'general', 'Contact phone number'),
('contact_address', '{"en": "Riyadh, Saudi Arabia", "ar": "الرياض، المملكة العربية السعودية"}', 'general', 'Contact address'),

-- Logo Settings
('main_logo', '"/images/home/logo/WonderlandLogo.svg"', 'logo', 'Main website logo'),
('footer_logo', '"/images/home/logo/WonderlandLogoWhite.svg"', 'logo', 'Footer logo (white)'),
('favicon', '"/favicon.ico"', 'logo', 'Website favicon'),
('logo_height', '48', 'logo', 'Logo height in pixels'),
('show_logo_text', 'true', 'logo', 'Show logo text next to image'),
('logo_text', '{"en": "World Trip Agency", "ar": "أرض العجائب"}', 'logo', 'Logo text'),

-- Email Settings
('smtp_host', '""', 'email', 'SMTP server host'),
('smtp_port', '587', 'email', 'SMTP server port'),
('smtp_username', '""', 'email', 'SMTP username'),
('smtp_password', '""', 'email', 'SMTP password'),
('from_email', '"noreply@worldtripagency.com"', 'email', 'From email address'),
('from_name', '{"en": "World Trip Agency Traveling Agency", "ar": "وكالة أرض العجائب للسفر"}', 'email', 'From name'),

-- Payment Settings
('stripe_enabled', 'false', 'payment', 'Enable Stripe payment'),
('stripe_public_key', '""', 'payment', 'Stripe public key'),
('stripe_secret_key', '""', 'payment', 'Stripe secret key'),
('mada_enabled', 'true', 'payment', 'Enable Mada payment'),
('visa_enabled', 'true', 'payment', 'Enable Visa payment'),
('mastercard_enabled', 'true', 'payment', 'Enable Mastercard payment'),

-- SEO Settings
('meta_title', '{"en": "World Trip Agency - Specialized Travel Agency", "ar": "أرض العجائب - وكالة سفر متخصصة"}', 'seo', 'Meta title'),
('meta_description', '{"en": "Specialized travel agency for organizing tourist trips, Umrah and Hajj", "ar": "وكالة سفر متخصصة في تنظيم الرحلات السياحية والعمرة والحج"}', 'seo', 'Meta description'),
('meta_keywords', '{"en": "travel, trips, umrah, hajj, tourism", "ar": "سفر, رحلات, عمرة, حج, سياحة"}', 'seo', 'Meta keywords'),
('google_analytics_id', '""', 'seo', 'Google Analytics ID'),
('google_search_console', '""', 'seo', 'Google Search Console'),

-- Security Settings
('session_timeout', '24', 'security', 'Session timeout in hours'),
('require_strong_password', 'true', 'security', 'Require strong password'),
('enable_two_factor', 'false', 'security', 'Enable two-factor authentication'),
('enable_rate_limit', 'true', 'security', 'Enable rate limiting')

ON CONFLICT (key) DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
