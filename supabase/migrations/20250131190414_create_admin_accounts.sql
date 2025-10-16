-- Create admin accounts for World Trip Agency Traveling Agency
-- This migration creates additional admin accounts and ensures the default admin exists

-- Insert default admin user (password: admin123)
-- Email: info@worldtripagency.com
-- Password: admin123
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES ('info@worldtripagency.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'مدير النظام', 'super_admin')
ON CONFLICT (email) DO NOTHING;

-- Insert additional admin users for different roles
-- Manager account (password: manager123)
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES ('manager@wonderland.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'مدير المحتوى', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Support account (password: support123)
INSERT INTO admin_users (email, password_hash, name, role) 
VALUES ('support@wonderland.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'فريق الدعم', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Create some sample destinations
INSERT INTO destinations (name, name_en, description, description_en, country, city, image_url, is_featured, is_active)
VALUES 
  ('دبي', 'Dubai', 'مدينة دبي هي إحدى الإمارات السبع في دولة الإمارات العربية المتحدة، وتشتهر بناطحات السحاب الفاخرة والتسوق والترفيه.', 'Dubai is one of the seven emirates of the United Arab Emirates, famous for its luxury skyscrapers, shopping, and entertainment.', 'الإمارات العربية المتحدة', 'دبي', '/images/destinations/global/dubai.jpeg', true, true),
  ('تركيا', 'Turkey', 'تركيا دولة تقع في منطقة الأناضول وجنوب شرق أوروبا، تشتهر بالتاريخ العريق والثقافة الغنية والمناظر الطبيعية الخلابة.', 'Turkey is a country located in Anatolia and Southeast Europe, famous for its rich history, culture, and beautiful landscapes.', 'تركيا', 'إسطنبول', '/images/destinations/global/turkey.jpeg', true, true),
  ('مصر', 'Egypt', 'مصر دولة عربية تقع في شمال أفريقيا، تشتهر بالحضارة الفرعونية القديمة والأهرامات والمعابد التاريخية.', 'Egypt is an Arab country located in North Africa, famous for its ancient Pharaonic civilization, pyramids, and historical temples.', 'مصر', 'القاهرة', '/images/destinations/global/egypt.jpeg', true, true),
  ('مكة المكرمة', 'Makkah', 'مكة المكرمة هي أقدس مدينة في الإسلام، حيث يقع الكعبة المشرفة والمسجد الحرام.', 'Makkah is the holiest city in Islam, where the Kaaba and the Grand Mosque are located.', 'السعودية', 'مكة المكرمة', '/images/destinations/saudi/makkah.jpeg', true, true),
  ('المدينة المنورة', 'Madinah', 'المدينة المنورة هي ثاني أقدس مدينة في الإسلام، حيث يقع المسجد النبوي وقبر النبي محمد صلى الله عليه وسلم.', 'Madinah is the second holiest city in Islam, where the Prophet''s Mosque and the tomb of Prophet Muhammad (PBUH) are located.', 'السعودية', 'المدينة المنورة', '/images/destinations/saudi/madinah.jpeg', true, true)
ON CONFLICT DO NOTHING;

-- Create some sample packages
INSERT INTO packages (title, description, price, duration_days, destination, image_url)
VALUES 
  ('رحلة إلى دبي', 'رحلة مميزة إلى دبي تشمل الإقامة في فندق 5 نجوم، تذاكر الطيران، وجولات سياحية في أهم المعالم.', 2500.00, 5, 'دبي', '/images/packages/home/package-1.jpeg'),
  ('عمرة رمضان', 'عمرة مباركة في شهر رمضان المبارك تشمل الإقامة قريباً من الحرم المكي، وجولات في مكة والمدينة.', 1800.00, 7, 'مكة المكرمة', '/images/packages/home/package-1.jpeg'),
  ('رحلة إلى تركيا', 'رحلة شاملة إلى تركيا تشمل زيارة إسطنبول وكابادوكيا، مع الإقامة في فنادق فاخرة.', 3200.00, 8, 'تركيا', '/images/packages/home/package-1.jpeg'),
  ('رحلة إلى مصر', 'رحلة تاريخية إلى مصر تشمل زيارة الأهرامات وأبو الهول ومعابد الأقصر وأسوان.', 2200.00, 6, 'مصر', '/images/packages/home/package-1.jpeg'),
  ('رحلة إلى المدينة المنورة', 'رحلة روحانية إلى المدينة المنورة تشمل زيارة المسجد النبوي والبقيع وجبل أحد.', 1500.00, 4, 'المدينة المنورة', '/images/packages/home/package-1.jpeg')
ON CONFLICT DO NOTHING;

-- Create some sample bookings
INSERT INTO bookings (package_id, customer_name, customer_email, customer_phone, number_of_people, total_price, status, booking_date, special_requests)
SELECT 
  p.id,
  'أحمد محمد',
  'ahmed@example.com',
  '+966501234567',
  2,
  p.price * 2,
  'pending',
  CURRENT_DATE + INTERVAL '30 days',
  'أريد غرفة متصلة'
FROM packages p WHERE p.title = 'رحلة إلى دبي'
LIMIT 1;

INSERT INTO bookings (package_id, customer_name, customer_email, customer_phone, number_of_people, total_price, status, booking_date)
SELECT 
  p.id,
  'فاطمة علي',
  'fatima@example.com',
  '+966507654321',
  4,
  p.price * 4,
  'confirmed',
  CURRENT_DATE + INTERVAL '45 days'
FROM packages p WHERE p.title = 'عمرة رمضان'
LIMIT 1;

INSERT INTO bookings (package_id, customer_name, customer_email, customer_phone, number_of_people, total_price, status, booking_date)
SELECT 
  p.id,
  'محمد السعد',
  'mohammed@example.com',
  '+966509876543',
  3,
  p.price * 3,
  'completed',
  CURRENT_DATE - INTERVAL '10 days'
FROM packages p WHERE p.title = 'رحلة إلى تركيا'
LIMIT 1;

-- Create some sample package inquiries
INSERT INTO package_inquiries (name, email, phone, package_id, package_name, message, locale, notification_sent)
SELECT 
  'سارة أحمد',
  'sara@example.com',
  '+966501111111',
  p.id,
  p.title,
  'أريد الاستفسار عن تفاصيل هذه الرحلة، هل تتضمن تذاكر الطيران؟',
  'ar-SA',
  false
FROM packages p WHERE p.title = 'رحلة إلى دبي'
LIMIT 1;

INSERT INTO package_inquiries (name, email, phone, package_id, package_name, message, locale, notification_sent)
SELECT 
  'عبدالله الخالدي',
  'abdullah@example.com',
  '+966502222222',
  p.id,
  p.title,
  'ما هي أفضل الأوقات لحجز هذه العمرة؟',
  'ar-SA',
  false
FROM packages p WHERE p.title = 'عمرة رمضان'
LIMIT 1;

-- Create some sample destination inquiries
INSERT INTO destination_inquiries (name, email, phone, destination_name, message, locale, notification_sent)
VALUES 
  ('نورا محمد', 'nora@example.com', '+966503333333', 'تركيا', 'أريد معرفة أفضل الأماكن السياحية في تركيا', 'ar-SA', false),
  ('خالد العتيبي', 'khalid@example.com', '+966504444444', 'مصر', 'ما هي أفضل الأوقات لزيارة مصر؟', 'ar-SA', false);

-- Create some sample notifications
INSERT INTO notifications (title, title_en, message, message_en, type, admin_user_id)
SELECT 
  'حجز جديد',
  'New Booking',
  'تم استلام حجز جديد من العميل أحمد محمد',
  'New booking received from customer Ahmed Mohammed',
  'info',
  au.id
FROM admin_users au WHERE au.email = 'info@worldtripagency.com'
LIMIT 1;

INSERT INTO notifications (title, title_en, message, message_en, type, admin_user_id)
SELECT 
  'رسالة جديدة',
  'New Message',
  'تم استلام رسالة جديدة من العميل سارة أحمد',
  'New message received from customer Sara Ahmed',
  'info',
  au.id
FROM admin_users au WHERE au.email = 'info@worldtripagency.com'
LIMIT 1;

-- Create some sample SEO settings
INSERT INTO seo_settings (page_path, title, title_en, description, description_en, keywords, keywords_en, is_indexed)
VALUES 
  ('/', 'World Trip Agency - وكالة السفر المفضلة', 'World Trip Agency - Your Preferred Travel Agency', 'اكتشف أفضل عروض السفر والحجوزات مع World Trip Agency. رحلات داخلية وخارجية، عمرة، وحج بأسعار منافسة.', 'Discover the best travel offers and bookings with World Trip Agency. Domestic and international trips, Umrah, and Hajj at competitive prices.', 'سفر, رحلات, عمرة, حج, دبي, تركيا, مصر', 'travel, trips, umrah, hajj, dubai, turkey, egypt', true),
  ('/packages', 'باقات السفر - World Trip Agency', 'Travel Packages - World Trip Agency', 'تصفح جميع باقات السفر المتاحة لدينا. رحلات منظمة بأسعار مميزة لجميع الوجهات.', 'Browse all our available travel packages. Organized trips at special prices to all destinations.', 'باقات سفر, رحلات منظمة, عروض سفر', 'travel packages, organized trips, travel offers', true),
  ('/destinations', 'الوجهات السياحية - World Trip Agency', 'Tourist Destinations - World Trip Agency', 'اكتشف أجمل الوجهات السياحية حول العالم. وجهات داخلية وخارجية لجميع الأذواق.', 'Discover the most beautiful tourist destinations around the world. Domestic and international destinations for all tastes.', 'وجهات سياحية, أماكن سياحية, سفر', 'tourist destinations, tourist places, travel', true);

-- Update admin user last login to show they are active
UPDATE admin_users 
SET last_login = NOW() 
WHERE email = 'info@worldtripagency.com';
