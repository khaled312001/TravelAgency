-- =============================================
-- إضافة البكجات الجديدة مع الصور
-- =============================================

-- حذف البكجات القديمة (اختياري)
-- DELETE FROM package_options WHERE package_id IN (SELECT id FROM packages);
-- DELETE FROM packages;

-- إدراج البكجات الجديدة مع الصور
INSERT INTO packages (title_ar, title_en, description_ar, description_en, price, duration_days, max_persons, featured, travel_period, image_url)
VALUES 
    -- البكجات الدولية
    ('رحلة باريس الرومانسية', 'Romantic Paris Trip', 'رحلة رومانسية لمدينة النور تشمل زيارة برج إيفل وقصر فرساي واللوفر مع إقامة في فندق فاخر', 'Romantic trip to the City of Light including Eiffel Tower, Versailles Palace, and Louvre with luxury hotel accommodation', 3500.00, 5, 2, true, 'Spring', '/images/packages/destinations/paris-romantic.jpeg'),
    
    ('جولة لندن الكلاسيكية', 'Classic London Tour', 'جولة شاملة في عاصمة بريطانيا تشمل زيارة قصر باكنغهام وبرج لندن وجسر لندن مع جولات نهرية', 'Comprehensive tour of Britain''s capital including Buckingham Palace, Tower of London, and London Bridge with river cruises', 4200.00, 7, 4, true, 'Summer', '/images/packages/destinations/london-classic.jpeg'),
    
    ('رحلة اسطنبول التاريخية', 'Historical Istanbul Trip', 'اكتشف تاريخ وحضارة اسطنبول مع زيارة آيا صوفيا والمسجد الأزرق وقصر توبكابي', 'Discover Istanbul''s history and culture with visits to Hagia Sophia, Blue Mosque, and Topkapi Palace', 2800.00, 6, 4, true, 'Autumn', '/images/packages/destinations/istanbul-historical.jpeg'),
    
    ('مغامرة تايلاند الاستوائية', 'Tropical Thailand Adventure', 'استكشف جمال تايلاند مع زيارة بانكوك وشيانغ ماي وجزر في في مع أنشطة الغوص والاسترخاء', 'Explore Thailand''s beauty with visits to Bangkok, Chiang Mai, and Phi Phi Islands with diving and relaxation activities', 3200.00, 8, 6, true, 'Winter', '/images/packages/destinations/thailand-adventure.jpeg'),
    
    ('رحلة المغرب الثقافية', 'Cultural Morocco Trip', 'اكتشف سحر المغرب مع زيارة مراكش وفاس والرباط مع التجول في الأسواق التقليدية', 'Discover Morocco''s charm with visits to Marrakech, Fez, and Rabat with traditional market tours', 2500.00, 7, 4, false, 'All Year', '/images/packages/destinations/morocco-cultural.jpeg'),
    
    ('جولة برشلونة الفنية', 'Artistic Barcelona Tour', 'استكشف الفن والعمارة في برشلونة مع زيارة أعمال غاودي ومتحف بيكاسو', 'Explore art and architecture in Barcelona with visits to Gaudi''s works and Picasso Museum', 3000.00, 5, 4, false, 'Spring', '/images/packages/destinations/barcelona-artistic.jpeg'),
    
    ('رحلة مدريد الملكية', 'Royal Madrid Trip', 'اكتشف العاصمة الإسبانية مع زيارة القصر الملكي ومتحف برادو وبلازا مايور', 'Discover the Spanish capital with visits to Royal Palace, Prado Museum, and Plaza Mayor', 2800.00, 5, 4, false, 'Autumn', '/images/packages/destinations/madrid-royal.jpeg'),
    
    ('مغامرة جورجيا الجبلية', 'Mountain Georgia Adventure', 'استكشف جمال جورجيا الجبلي مع زيارة تبليسي وباتومي مع أنشطة التسلق والمشي', 'Explore Georgia''s mountain beauty with visits to Tbilisi and Batumi with climbing and hiking activities', 2200.00, 6, 4, false, 'Summer', '/images/packages/destinations/georgia-mountain.jpeg'),
    
    ('رحلة شرم الشيخ للغوص', 'Sharm El Sheikh Diving Trip', 'مغامرة غوص في البحر الأحمر مع زيارة الشعاب المرجانية والأنشطة المائية', 'Red Sea diving adventure with coral reef visits and water activities', 2000.00, 4, 6, false, 'All Year', '/images/packages/destinations/sharm-diving.jpeg'),
    
    -- البكجات السعودية
    ('جولة الرياض التراثية', 'Heritage Riyadh Tour', 'استكشف تراث وثقافة الرياض مع زيارة الدرعية وحي الطريف وبرج المملكة', 'Explore Riyadh''s heritage and culture with visits to Diriyah, At-Turaif District, and Kingdom Tower', 1500.00, 3, 8, true, 'All Year', '/images/packages/destinations/riyadh-heritage.jpeg'),
    
    ('رحلة العلا الأثرية', 'Archaeological AlUla Trip', 'اكتشف آثار العلا القديمة مع زيارة مدائن صالح والمناظر الطبيعية الخلابة', 'Discover ancient AlUla with visits to Mada''in Saleh and stunning natural landscapes', 1800.00, 4, 6, true, 'Winter', '/images/packages/destinations/alula-archaeological.jpeg'),
    
    ('رحلة جدة الساحلية', 'Coastal Jeddah Trip', 'استمتع بساحل جدة مع زيارة الكورنيش والبلدة القديمة والأنشطة البحرية', 'Enjoy Jeddah''s coast with visits to the Corniche, Old Town, and marine activities', 1200.00, 3, 6, false, 'All Year', '/images/packages/destinations/jeddah-coastal.jpeg')
ON CONFLICT DO NOTHING;

-- إدراج خيارات الباقات
INSERT INTO package_options (package_id, flight, hotel, transportation, hotel_grade)
SELECT 
    p.id,
    CASE 
        WHEN p.title_en LIKE '%Paris%' OR p.title_en LIKE '%London%' OR p.title_en LIKE '%Thailand%' THEN true
        ELSE false
    END as flight,
    true as hotel,
    CASE 
        WHEN p.title_en LIKE '%Thailand%' OR p.title_en LIKE '%Morocco%' THEN true
        ELSE false
    END as transportation,
    CASE 
        WHEN p.title_en LIKE '%Paris%' OR p.title_en LIKE '%London%' THEN '5'
        WHEN p.title_en LIKE '%Istanbul%' OR p.title_en LIKE '%Thailand%' THEN '4'
        ELSE '3'
    END as hotel_grade
FROM packages p
WHERE p.title_ar IN (
    'رحلة باريس الرومانسية', 'جولة لندن الكلاسيكية', 'رحلة اسطنبول التاريخية',
    'مغامرة تايلاند الاستوائية', 'رحلة المغرب الثقافية', 'جولة برشلونة الفنية',
    'رحلة مدريد الملكية', 'مغامرة جورجيا الجبلية', 'رحلة شرم الشيخ للغوص',
    'جولة الرياض التراثية', 'رحلة العلا الأثرية', 'رحلة جدة الساحلية'
)
ON CONFLICT DO NOTHING;
