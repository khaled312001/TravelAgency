-- =============================================
-- إضافة البكجات الـ 12 الجديدة إلى قاعدة البيانات
-- =============================================

-- حذف البكجات القديمة (اختياري - يمكن حذف هذا الجزء إذا كنت تريد الاحتفاظ بالبكجات الموجودة)
-- DELETE FROM package_options WHERE package_id IN (SELECT id FROM packages);
-- DELETE FROM packages;

-- إدراج البكجات الجديدة مع الصور
INSERT INTO packages (title_ar, title_en, description_ar, description_en, price, duration_days, max_persons, featured, travel_period, image_url, status, category)
VALUES 
    -- البكجات الدولية
    ('رحلة باريس الرومانسية', 'Romantic Paris Trip', 'رحلة رومانسية لمدينة النور تشمل زيارة برج إيفل وقصر فرساي واللوفر مع إقامة في فندق فاخر', 'Romantic trip to the City of Light including Eiffel Tower, Versailles Palace, and Louvre with luxury hotel accommodation', 3500.00, 5, 2, true, 'Spring', '/images/packages/destinations/paris-romantic.jpeg', 'active', 'international'),
    
    ('جولة لندن الكلاسيكية', 'Classic London Tour', 'جولة شاملة في عاصمة بريطانيا تشمل زيارة قصر باكنغهام وبرج لندن وجسر لندن مع جولات في المتاحف الشهيرة', 'Comprehensive tour of the British capital including Buckingham Palace, Tower of London, and London Bridge with visits to famous museums', 4200.00, 7, 4, true, 'Summer', '/images/packages/destinations/london-classic.jpeg', 'active', 'international'),
    
    ('رحلة اسطنبول التاريخية', 'Historical Istanbul Journey', 'اكتشف جمال اسطنبول التاريخية مع زيارة آيا صوفيا والمسجد الأزرق وقصر توبكابي مع رحلات بحرية في البوسفور', 'Discover the historical beauty of Istanbul with visits to Hagia Sophia, Blue Mosque, and Topkapi Palace with Bosphorus cruises', 2800.00, 6, 6, true, 'Spring', '/images/packages/destinations/istanbul-historical.jpeg', 'active', 'international'),
    
    ('مغامرة تايلاند الاستوائية', 'Tropical Thailand Adventure', 'مغامرة استوائية في تايلاند تشمل بانكوك وشاطئ باتايا مع جولات في المعابد الذهبية والغابات الاستوائية', 'Tropical adventure in Thailand including Bangkok and Pattaya Beach with tours of golden temples and tropical forests', 3200.00, 8, 4, true, 'Winter', '/images/packages/destinations/thailand-adventure.jpeg', 'active', 'international'),
    
    ('رحلة المغرب الثقافية', 'Cultural Morocco Trip', 'رحلة ثقافية غنية في المغرب تشمل مراكش وفاس مع زيارة الأسواق التقليدية والمدن القديمة', 'Rich cultural trip to Morocco including Marrakech and Fez with visits to traditional markets and ancient cities', 2900.00, 7, 4, true, 'Spring', '/images/packages/destinations/morocco-cultural.jpeg', 'active', 'international'),
    
    ('مغامرة شرم الشيخ الغوص', 'Sharm El Sheikh Diving Adventure', 'مغامرة غوص في شرم الشيخ مع رحلات بحرية في البحر الأحمر واستكشاف الشعاب المرجانية الملونة', 'Diving adventure in Sharm El Sheikh with Red Sea cruises and exploration of colorful coral reefs', 2500.00, 6, 4, true, 'Summer', '/images/packages/destinations/sharm-diving.jpeg', 'active', 'international'),
    
    ('رحلة جورجيا الجبلية', 'Mountain Georgia Trip', 'رحلة جبلية في جورجيا تشمل تبليسي وبحيرة ريتسا مع جولات في القرى الجبلية التقليدية', 'Mountain trip to Georgia including Tbilisi and Lake Ritsa with tours of traditional mountain villages', 2200.00, 5, 4, true, 'Summer', '/images/packages/destinations/georgia-mountain.jpeg', 'active', 'international'),
    
    ('جولة برشلونة الفنية', 'Artistic Barcelona Tour', 'جولة فنية في برشلونة تشمل أعمال غاودي ومتحف بيكاسو مع جولات في الحي القوطي القديم', 'Artistic tour of Barcelona including Gaudi works and Picasso Museum with tours of the old Gothic Quarter', 3800.00, 6, 4, true, 'Spring', '/images/packages/destinations/barcelona-artistic.jpeg', 'active', 'international'),
    
    ('رحلة مدريد الملكية', 'Royal Madrid Trip', 'رحلة ملكية في مدريد تشمل قصر ريال مدريد ومتحف برادو مع جولات في الساحات التاريخية', 'Royal trip to Madrid including Royal Palace and Prado Museum with tours of historical squares', 3600.00, 5, 4, true, 'Autumn', '/images/packages/destinations/madrid-royal.jpeg', 'active', 'international'),
    
    -- البكجات السعودية
    ('جولة الرياض التراثية', 'Heritage Riyadh Tour', 'جولة تراثية في الرياض تشمل البلدة القديمة ومتحف الملك عبدالعزيز مع زيارة قصر المصمك التاريخي', 'Heritage tour of Riyadh including the old town and King Abdulaziz Museum with a visit to the historic Masmak Palace', 1500.00, 3, 6, true, 'Winter', '/images/packages/destinations/riyadh-heritage.jpeg', 'active', 'domestic'),
    
    ('رحلة العلا الأثرية', 'Archaeological AlUla Trip', 'رحلة أثرية في العلا تشمل مدائن صالح والجبل الأحمر مع جولات في المواقع الأثرية القديمة', 'Archaeological trip to AlUla including Madain Saleh and Red Mountain with tours of ancient archaeological sites', 1800.00, 4, 4, true, 'Winter', '/images/packages/destinations/alula-archaeological.jpeg', 'active', 'domestic'),
    
    ('رحلة جدة الساحلية', 'Coastal Jeddah Trip', 'رحلة ساحلية في جدة تشمل الكورنيش والبلدة القديمة مع جولات في الأسواق التقليدية والمطاعم الشعبية', 'Coastal trip to Jeddah including the Corniche and old town with tours of traditional markets and popular restaurants', 1200.00, 3, 6, true, 'Summer', '/images/packages/destinations/jeddah-coastal.jpeg', 'active', 'domestic');

-- إضافة خيارات البكجات
INSERT INTO package_options (package_id, flight, hotel, transportation, hotel_grade)
SELECT 
    p.id,
    CASE 
        WHEN p.category = 'international' THEN true
        ELSE false
    END as flight,
    true as hotel,
    CASE 
        WHEN p.category = 'international' THEN true
        ELSE false
    END as transportation,
    CASE 
        WHEN p.price >= 3000 THEN 5
        WHEN p.price >= 2000 THEN 4
        ELSE 3
    END as hotel_grade
FROM packages p
WHERE p.title_ar IN (
    'رحلة باريس الرومانسية',
    'جولة لندن الكلاسيكية', 
    'رحلة اسطنبول التاريخية',
    'مغامرة تايلاند الاستوائية',
    'رحلة المغرب الثقافية',
    'مغامرة شرم الشيخ الغوص',
    'رحلة جورجيا الجبلية',
    'جولة برشلونة الفنية',
    'رحلة مدريد الملكية',
    'جولة الرياض التراثية',
    'رحلة العلا الأثرية',
    'رحلة جدة الساحلية'
);
