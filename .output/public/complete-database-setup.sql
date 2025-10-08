-- =============================================
-- إعداد قاعدة البيانات الكاملة لوكالة السفر
-- =============================================

-- 1. إنشاء جدول الباقات
CREATE TABLE IF NOT EXISTS packages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title_ar VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    price DECIMAL(10,2) NOT NULL,
    duration_days INTEGER NOT NULL,
    max_persons INTEGER DEFAULT 1,
    image_url TEXT,
    featured BOOLEAN DEFAULT false,
    travel_period VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. إنشاء جدول خيارات الباقات
CREATE TABLE IF NOT EXISTS package_options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
    flight BOOLEAN DEFAULT false,
    hotel BOOLEAN DEFAULT false,
    transportation BOOLEAN DEFAULT false,
    hotel_grade VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. إنشاء جدول الوجهات
CREATE TABLE IF NOT EXISTS destinations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_ar TEXT,
    description_en TEXT,
    country VARCHAR(100) NOT NULL,
    image_url TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. إنشاء جدول الحجوزات
CREATE TABLE IF NOT EXISTS bookings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    package_id UUID REFERENCES packages(id),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    travel_date DATE,
    number_of_persons INTEGER DEFAULT 1,
    total_price DECIMAL(10,2),
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. إنشاء جدول رسائل الاتصال
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. إنشاء جدول مستخدمي الإدارة
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. إنشاء جدول جلسات الإدارة
CREATE TABLE IF NOT EXISTS admin_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. إنشاء جدول سجل أنشطة الإدارة
CREATE TABLE IF NOT EXISTS admin_activity_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id UUID,
    details JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. إنشاء جدول إعدادات SEO
CREATE TABLE IF NOT EXISTS seo_settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page VARCHAR(100) UNIQUE NOT NULL,
    title_ar VARCHAR(255),
    title_en VARCHAR(255),
    description_ar TEXT,
    description_en TEXT,
    keywords_ar TEXT,
    keywords_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. إنشاء جدول الإشعارات
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- إدراج البيانات الأساسية
-- =============================================

-- إدراج حسابات الإدارة
INSERT INTO admin_users (email, password_hash, name, role, is_active)
VALUES 
    ('admin@wonderland.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'مدير النظام', 'super_admin', true),
    ('manager@wonderland.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'مدير المحتوى', 'admin', true)
ON CONFLICT (email) DO UPDATE SET
    password_hash = EXCLUDED.password_hash,
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- إدراج بعض الوجهات الأساسية
INSERT INTO destinations (name_ar, name_en, description_ar, description_en, country, featured)
VALUES 
    ('باريس', 'Paris', 'مدينة النور والرومانسية', 'City of Light and Romance', 'France', true),
    ('لندن', 'London', 'عاصمة بريطانيا العظمى', 'Capital of Great Britain', 'UK', true),
    ('دبي', 'Dubai', 'مدينة المستقبل', 'City of the Future', 'UAE', true),
    ('اسطنبول', 'Istanbul', 'مدينة القارتين', 'City of Two Continents', 'Turkey', true),
    ('الرياض', 'Riyadh', 'عاصمة المملكة العربية السعودية', 'Capital of Saudi Arabia', 'Saudi Arabia', true)
ON CONFLICT DO NOTHING;

-- إدراج بعض الباقات الأساسية
INSERT INTO packages (title_ar, title_en, description_ar, description_en, price, duration_days, max_persons, featured, travel_period)
VALUES 
    ('رحلة باريس الرومانسية', 'Romantic Paris Trip', 'رحلة رومانسية لمدينة النور', 'Romantic trip to the City of Light', 2500.00, 5, 2, true, 'Spring'),
    ('جولة لندن الكلاسيكية', 'Classic London Tour', 'جولة شاملة في عاصمة بريطانيا', 'Comprehensive tour of Britain''s capital', 3000.00, 7, 4, true, 'Summer'),
    ('مغامرة دبي المستقبلية', 'Dubai Future Adventure', 'استكشف مدينة المستقبل', 'Explore the city of the future', 2000.00, 4, 6, true, 'Winter'),
    ('رحلة اسطنبول التاريخية', 'Historical Istanbul Trip', 'اكتشف تاريخ وحضارة اسطنبول', 'Discover Istanbul''s history and culture', 1800.00, 6, 4, false, 'Autumn'),
    ('جولة الرياض التراثية', 'Heritage Riyadh Tour', 'استكشف تراث وثقافة الرياض', 'Explore Riyadh''s heritage and culture', 1200.00, 3, 8, false, 'All Year')
ON CONFLICT DO NOTHING;

-- إدراج خيارات الباقات
INSERT INTO package_options (package_id, flight, hotel, transportation, hotel_grade)
SELECT 
    p.id,
    true,
    true,
    true,
    '5 Star'
FROM packages p
WHERE p.title_ar = 'رحلة باريس الرومانسية'
ON CONFLICT DO NOTHING;

INSERT INTO package_options (package_id, flight, hotel, transportation, hotel_grade)
SELECT 
    p.id,
    true,
    true,
    true,
    '4 Star'
FROM packages p
WHERE p.title_ar = 'جولة لندن الكلاسيكية'
ON CONFLICT DO NOTHING;

INSERT INTO package_options (package_id, flight, hotel, transportation, hotel_grade)
SELECT 
    p.id,
    true,
    true,
    true,
    '5 Star'
FROM packages p
WHERE p.title_ar = 'مغامرة دبي المستقبلية'
ON CONFLICT DO NOTHING;

-- إدراج إعدادات SEO الأساسية
INSERT INTO seo_settings (page, title_ar, title_en, description_ar, description_en, keywords_ar, keywords_en)
VALUES 
    ('home', 'أرض العجائب للسفر والسياحة', 'Wonderland Travel & Tourism', 'أفضل وكالة سفر وسياحة في المملكة', 'Best travel and tourism agency in the Kingdom', 'سفر, سياحة, رحلات, باقات', 'travel, tourism, trips, packages'),
    ('packages', 'باقات السفر والسياحة', 'Travel & Tourism Packages', 'اكتشف أفضل باقات السفر والسياحة', 'Discover the best travel and tourism packages', 'باقات سفر, رحلات, سياحة', 'travel packages, trips, tourism'),
    ('destinations', 'وجهات السفر', 'Travel Destinations', 'استكشف أجمل وجهات السفر حول العالم', 'Explore the most beautiful travel destinations around the world', 'وجهات سفر, دول, مدن', 'travel destinations, countries, cities'),
    ('about', 'عن أرض العجائب', 'About Wonderland', 'تعرف على وكالة أرض العجائب للسفر والسياحة', 'Learn about Wonderland Travel & Tourism Agency', 'عن الشركة, وكالة سفر', 'about company, travel agency')
ON CONFLICT (page) DO UPDATE SET
    title_ar = EXCLUDED.title_ar,
    title_en = EXCLUDED.title_en,
    description_ar = EXCLUDED.description_ar,
    description_en = EXCLUDED.description_en,
    keywords_ar = EXCLUDED.keywords_ar,
    keywords_en = EXCLUDED.keywords_en,
    updated_at = NOW();

-- إدراج بعض الإشعارات الأساسية
INSERT INTO notifications (title, message, type)
VALUES 
    ('مرحباً بك في نظام الإدارة', 'تم إعداد نظام الإدارة بنجاح', 'success'),
    ('نظام جاهز للاستخدام', 'يمكنك الآن إدارة الباقات والحجوزات', 'info'),
    ('تذكير', 'تأكد من تحديث البيانات بانتظام', 'warning')
ON CONFLICT DO NOTHING;

-- =============================================
-- إنشاء الفهارس لتحسين الأداء
-- =============================================

CREATE INDEX IF NOT EXISTS idx_packages_featured ON packages(featured);
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON packages(created_at);
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(featured);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expires ON admin_sessions(expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_logs_created_at ON admin_activity_logs(created_at);

-- =============================================
-- التحقق من البيانات
-- =============================================

-- عرض عدد السجلات في كل جدول
SELECT 'packages' as table_name, COUNT(*) as count FROM packages
UNION ALL
SELECT 'destinations', COUNT(*) FROM destinations
UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings
UNION ALL
SELECT 'contact_messages', COUNT(*) FROM contact_messages
UNION ALL
SELECT 'admin_users', COUNT(*) FROM admin_users
UNION ALL
SELECT 'seo_settings', COUNT(*) FROM seo_settings
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications;

-- عرض حسابات الإدارة
SELECT 
    id,
    email,
    name,
    role,
    is_active,
    created_at
FROM admin_users
ORDER BY created_at;
