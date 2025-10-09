-- =============================================
-- إنشاء جدول الوجهات وإدخال البيانات
-- =============================================

-- 1. إنشاء جدول الوجهات
CREATE TABLE IF NOT EXISTS destinations (
    id VARCHAR(50) PRIMARY KEY,
    name_ar VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    description_ar TEXT NOT NULL,
    description_en TEXT NOT NULL,
    region_ar VARCHAR(255) NOT NULL,
    region_en VARCHAR(255) NOT NULL,
    location_type_ar VARCHAR(100) NOT NULL,
    location_type_en VARCHAR(100) NOT NULL,
    destination_type_ar VARCHAR(100) NOT NULL,
    destination_type_en VARCHAR(100) NOT NULL,
    main_image VARCHAR(500) NOT NULL,
    gallery JSONB DEFAULT '[]'::jsonb,
    tourist_spots JSONB DEFAULT '[]'::jsonb,
    upcoming_events JSONB DEFAULT '[]'::jsonb,
    coordinates JSONB DEFAULT '{}'::jsonb,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. إدخال الوجهات السعودية
INSERT INTO destinations (
    id, name_ar, name_en, description_ar, description_en, 
    region_ar, region_en, location_type_ar, location_type_en,
    destination_type_ar, destination_type_en, main_image,
    gallery, tourist_spots, upcoming_events, coordinates, featured
) VALUES 
-- الرياض
(
    'riyadh',
    'الرياض',
    'Riyadh',
    'مدينة عصرية تنهض من الصحراء، تمزج بين التراث التاريخي والرؤية المستقبلية',
    'A modern metropolis rising from the desert, blending historical heritage with futuristic vision',
    'منطقة الرياض',
    'Riyadh Region',
    'مدينة',
    'Urban',
    'حضري',
    'Metropolitan',
    '/images/destinations/saudi/riyadh/Riyadh1.jpeg',
    '[]'::jsonb,
    '[
        {
            "id": "kingdom-centre",
            "name_ar": "برج المملكة",
            "name_en": "Kingdom Centre",
            "description_ar": "ناطحة سحاب أيقونية من 99 طابقاً مع جسر سماوي للمشاهدة",
            "description_en": "Iconic 99-floor skyscraper with sky bridge observation deck",
            "image": "https://images.pexels.com/photos/35761/pexels-photo.jpg"
        },
        {
            "id": "diriyah",
            "name_ar": "الدرعية",
            "name_en": "Diriyah",
            "description_ar": "موقع تراث عالمي لليونسكو ومهد الدولة السعودية الأولى",
            "description_en": "UNESCO World Heritage site and the birthplace of the first Saudi state",
            "image": "https://images.pexels.com/photos/1885720/pexels-photo-1885720.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "riyadh-season",
            "title_ar": "موسم الرياض 2025",
            "title_en": "Riyadh Season 2025",
            "description_ar": "مهرجان ترفيهي سنوي يتضمن حفلات موسيقية وعروض وفعاليات ثقافية",
            "description_en": "Annual entertainment festival featuring concerts, shows, and cultural events",
            "date": "2025-10-15",
            "image": "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 24.7136, "longitude": 46.6753}'::jsonb,
    true
),

-- البحر الأحمر
(
    'red-sea',
    'البحر الأحمر',
    'Red Sea',
    'ساحل نقي بمياه صافية وشعاب مرجانية ومنتجعات فاخرة',
    'Pristine coastline with crystal-clear waters, coral reefs, and luxury resorts',
    'منطقة البحر الأحمر',
    'Red Sea Region',
    'ساحلي',
    'Coastal',
    'شاطئي',
    'Beach',
    'https://images.pexels.com/photos/1320684/pexels-photo-1320684.jpeg',
    '[]'::jsonb,
    '[
        {
            "id": "coral-reefs",
            "name_ar": "الشعاب المرجانية",
            "name_en": "Coral Reefs",
            "description_ar": "نظام بيئي بحري نابض بالحياة مع أنواع متنوعة من الشعاب المرجانية والحياة البحرية",
            "description_en": "Vibrant marine ecosystem with diverse coral species and sea life",
            "image": "https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "red-sea-film-festival",
            "title_ar": "مهرجان البحر الأحمر السينمائي الدولي",
            "title_en": "Red Sea International Film Festival",
            "description_ar": "مهرجان سينمائي سنوي يعرض السينما العالمية والإقليمية",
            "description_en": "Annual film festival showcasing international and regional cinema",
            "date": "2025-12-05",
            "image": "https://images.pexels.com/photos/3601427/pexels-photo-3601427.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 23.2285, "longitude": 38.9297}'::jsonb,
    true
),

-- جدة
(
    'jeddah',
    'جدة',
    'Jeddah',
    'مدينة ميناء تاريخية ذات تراث ثقافي غني وواجهة بحرية حديثة',
    'Historic port city with a rich cultural heritage and modern waterfront',
    'منطقة مكة المكرمة',
    'Makkah Region',
    'ساحلي',
    'Coastal',
    'ثقافي',
    'Cultural',
    '/images/destinations/saudi/jeddah/Jeddah1.jpeg',
    '[]'::jsonb,
    '[
        {
            "id": "al-balad",
            "name_ar": "البلد",
            "name_en": "Al-Balad",
            "description_ar": "موقع تراث عالمي لليونسكو يضم العمارة التقليدية والأسواق النابضة بالحياة",
            "description_en": "UNESCO World Heritage site featuring traditional architecture and bustling souks",
            "image": "https://images.pexels.com/photos/28506244/pexels-photo-28506244.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "jeddah-season",
            "title_ar": "موسم جدة",
            "title_en": "Jeddah Season",
            "description_ar": "مهرجان ثقافي وترفيهي يحتفي بتراث المدينة",
            "description_en": "Cultural and entertainment festival celebrating the city''s heritage",
            "date": "2025-06-01",
            "image": "https://images.pexels.com/photos/12692700/pexels-photo-12692700.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 21.5433, "longitude": 39.1728}'::jsonb,
    false
),

-- مكة المكرمة
(
    'makkah',
    'مكة المكرمة',
    'Makkah',
    'أقدس مدينة في الإسلام، موطن المسجد الحرام والمواقع الدينية القديمة',
    'The holiest city in Islam, home to the Grand Mosque and ancient religious sites',
    'منطقة مكة المكرمة',
    'Makkah Region',
    'ديني',
    'Religious',
    'روحاني',
    'Spiritual',
    '/images/destinations/saudi/Makkah/Makkah1.jpeg',
    '[]'::jsonb,
    '[
        {
            "id": "grand-mosque",
            "name_ar": "المسجد الحرام",
            "name_en": "The Grand Mosque",
            "description_ar": "أقدس موقع في الإسلام، يضم الكعبة والعمارة التاريخية",
            "description_en": "The holiest site in Islam, featuring the Kaaba and historic architecture",
            "image": "https://images.pexels.com/photos/18274181/pexels-photo-18274181.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "ramadan",
            "title_ar": "رمضان في مكة المكرمة",
            "title_en": "Ramadan in Makkah",
            "description_ar": "برامج رمضانية خاصة وفرص متزايدة للعبادة",
            "description_en": "Special Ramadan programs and increased worship opportunities",
            "date": "2025-03-01",
            "image": "https://images.pexels.com/photos/5550014/pexels-photo-5550014.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 21.4225, "longitude": 39.8262}'::jsonb,
    true
),

-- المدينة المنورة
(
    'medina',
    'المدينة المنورة',
    'Medina',
    'ثاني أقدس مدينة في الإسلام، معروفة بأجوائها الهادئة ومساجدها التاريخية',
    'The second-holiest city in Islam, known for its peaceful atmosphere and historical mosques',
    'منطقة المدينة المنورة',
    'Medina Region',
    'ديني',
    'Religious',
    'روحاني',
    'Spiritual',
    '/images/destinations/saudi/Medina/Medina1.jpeg',
    '[]'::jsonb,
    '[
        {
            "id": "prophets-mosque",
            "name_ar": "المسجد النبوي",
            "name_en": "Prophet''s Mosque",
            "description_ar": "ثاني أقدس موقع في الإسلام، بناه النبي محمد صلى الله عليه وسلم",
            "description_en": "The second-holiest site in Islam, built by Prophet Muhammad",
            "image": "https://images.pexels.com/photos/19495539/pexels-photo-19495539.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "eid-al-fitr",
            "title_ar": "احتفالات عيد الفطر",
            "title_en": "Eid Al-Fitr Celebrations",
            "description_ar": "احتفالات تقليدية تحيي نهاية شهر رمضان",
            "description_en": "Traditional celebrations marking the end of Ramadan",
            "date": "2025-04-20",
            "image": "https://images.pexels.com/photos/5550017/pexels-photo-5550017.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 24.5247, "longitude": 39.5692}'::jsonb,
    true
),

-- العلا
(
    'alula',
    'العلا',
    'Al Ula',
    'واحة قديمة تضم الحجر، أول موقع للتراث العالمي في المملكة العربية السعودية، مع مناظر صحراوية خلابة وتشكيلات صخرية',
    'Ancient oasis city featuring Hegra, Saudi Arabia''s first UNESCO World Heritage site, with stunning desert landscapes and rock formations',
    'منطقة المدينة المنورة',
    'Medina Region',
    'تاريخي',
    'Historical',
    'ثقافي',
    'Cultural',
    '/images/destinations/saudi/alula/AlUla1.jpeg',
    '[]'::jsonb,
    '[
        {
            "id": "hegra",
            "name_ar": "موقع الحجر الأثري",
            "name_en": "Hegra Archaeological Site",
            "description_ar": "مدينة نبطية قديمة تضم أكثر من 100 مقبرة أثرية محفوظة جيداً منحوتة في التكوينات الصخرية",
            "description_en": "Ancient Nabataean city with over 100 well-preserved monumental tombs carved in rock formations",
            "image": "https://images.pexels.com/photos/11215342/pexels-photo-11215342.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "winter-at-tantora",
            "title_ar": "شتاء طنطورة 2025",
            "title_en": "Winter at Tantora 2025",
            "description_ar": "مهرجان ثقافي يتضمن عروضاً موسيقية ومعارض فنية وتجارب تراثية",
            "description_en": "Cultural festival featuring music performances, art exhibitions, and heritage experiences",
            "date": "2025-12-21",
            "image": "https://images.pexels.com/photos/12555627/pexels-photo-12555627.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 26.6162, "longitude": 37.9159}'::jsonb,
    true
);

-- 3. إدخال الوجهات العالمية
INSERT INTO destinations (
    id, name_ar, name_en, description_ar, description_en, 
    region_ar, region_en, location_type_ar, location_type_en,
    destination_type_ar, destination_type_en, main_image,
    gallery, tourist_spots, upcoming_events, coordinates, featured
) VALUES 
-- برشلونة
(
    'barcelona',
    'برشلونة',
    'Barcelona',
    'مدينة متوسطية نابضة بالحياة تشتهر بهندستها المعمارية المذهلة وثقافتها الغنية ومزيج فريد من المعالم القوطية والحديثة',
    'A vibrant Mediterranean city known for its stunning architecture, rich culture, and the unique blend of Gothic and Modernist landmarks',
    'كتالونيا',
    'Catalonia',
    'ساحلي',
    'Coastal',
    'ثقافي',
    'Cultural',
    '/images/destinations/global/Barcelona/Barcelona1.jpeg',
    '["/images/destinations/global/Barcelona/Barcelona1.jpeg", "/images/destinations/global/Barcelona/Barcelona2.jpeg"]'::jsonb,
    '[
        {
            "id": "sagrada-familia",
            "name_ar": "ساغرادا فاميليا",
            "name_en": "Sagrada Familia",
            "description_ar": "تحفة غاودي وأشهر معالم برشلونة، هذه الكنيسة المذهلة قيد الإنشاء منذ عام 1882",
            "description_en": "Gaudí''s masterpiece and Barcelona''s most iconic landmark, this stunning basilica has been under construction since 1882",
            "image": "/images/destinations/global/Barcelona/Barcelona1.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "la-merce",
            "title_ar": "مهرجان لا ميرسي",
            "title_en": "La Mercè Festival",
            "description_ar": "أكبر مهرجان شوارع في برشلونة يضم الموسيقى والرقص والثقافة الكتالونية التقليدية",
            "description_en": "Barcelona''s biggest street festival featuring music, dance, and traditional Catalan culture",
            "date": "2025-09-24",
            "image": "/images/destinations/global/Barcelona/Barcelona2.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 41.3851, "longitude": 2.1734}'::jsonb,
    true
),

-- القاهرة
(
    'cairo',
    'القاهرة',
    'Cairo',
    'عاصمة مصر، مدينة يلتقي فيها التاريخ القديم بالحياة العصرية، وموطن آخر عجائب العالم القديم المتبقية',
    'The capital of Egypt, a city where ancient history meets modern life, home to the last remaining wonder of the ancient world',
    'محافظة القاهرة',
    'Cairo Governorate',
    'مدينة',
    'Urban',
    'تاريخي',
    'Historical',
    '/images/destinations/global/Cairo/Cairo1.jpeg',
    '["/images/destinations/global/Cairo/Cairo1.jpeg", "/images/destinations/global/Cairo/Cairo2.jpeg"]'::jsonb,
    '[
        {
            "id": "pyramids",
            "name_ar": "أهرامات الجيزة",
            "name_en": "Giza Pyramids",
            "description_ar": "آخر عجائب العالم القديم المتبقية، بنيت كمقابر للفراعنة العظماء",
            "description_en": "The last remaining wonder of the ancient world, built as tombs for the mighty Pharaohs",
            "image": "/images/destinations/global/Cairo/Cairo1.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "cairo-film-festival",
            "title_ar": "مهرجان القاهرة السينمائي الدولي",
            "title_en": "Cairo International Film Festival",
            "description_ar": "أحد أقدم وأشهر الفعاليات الثقافية في العالم العربي",
            "description_en": "One of the oldest and most celebrated cultural events in the Arab world",
            "date": "2025-11-20",
            "image": "/images/destinations/global/Cairo/Cairo2.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 30.0444, "longitude": 31.2357}'::jsonb,
    true
),

-- جورجيا
(
    'georgia',
    'جورجيا',
    'Georgia',
    'دولة في مفترق طرق أوروبا الشرقية وغرب آسيا، معروفة بمناظرها الطبيعية المتنوعة وتاريخها الغني وثقافة النبيذ الشهيرة',
    'A country at the intersection of Eastern Europe and Western Asia, known for its diverse landscapes, rich history, and renowned wine culture',
    'القوقاز',
    'Caucasus',
    'متنوع',
    'Diverse',
    'ثقافي',
    'Cultural',
    '/images/destinations/global/Georgia/Georgia1.jpeg',
    '["/images/destinations/global/Georgia/Georgia1.jpeg", "/images/destinations/global/Georgia/Georgia2.jpeg", "/images/destinations/global/Georgia/Georgia3.jpeg"]'::jsonb,
    '[
        {
            "id": "old-tbilisi",
            "name_ar": "تبليسي القديمة",
            "name_en": "Old Tbilisi",
            "description_ar": "حي تاريخي يضم منازل ملونة وكنائس قديمة وعمارة جورجية تقليدية",
            "description_en": "Historic district featuring colorful houses, ancient churches, and traditional Georgian architecture",
            "image": "/images/destinations/global/Georgia/Georgia1.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "tbilisoba",
            "title_ar": "مهرجان تبيليسوبا",
            "title_en": "Tbilisoba Festival",
            "description_ar": "مهرجان سنوي يحتفل بتنوع وتاريخ تبليسي مع النبيذ والطعام والموسيقى",
            "description_en": "Annual festival celebrating the diversity and history of Tbilisi with wine, food, and music",
            "date": "2025-10-15",
            "image": "/images/destinations/global/Georgia/Georgia3.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 41.7151, "longitude": 44.8271}'::jsonb,
    false
),

-- إسطنبول
(
    'istanbul',
    'إسطنبول',
    'Istanbul',
    'حيث يلتقي الشرق بالغرب، مدينة تمتد على قارتين بتاريخ غني',
    'Where East meets West, a city straddling two continents with rich history',
    'مرمرة',
    'Marmara',
    'ساحلي',
    'Coastal',
    'تاريخي',
    'Historical',
    '/images/destinations/global/Istanbul/Istanbul1.jpeg',
    '["/images/destinations/global/Istanbul/Istanbul1.jpeg", "/images/destinations/global/Istanbul/Istanbul2.jpeg", "/images/destinations/global/Istanbul/Istanbul3.jpeg"]'::jsonb,
    '[
        {
            "id": "hagia-sophia",
            "name_ar": "آيا صوفيا",
            "name_en": "Hagia Sophia",
            "description_ar": "تحفة معمارية بيزنطية، تحولت إلى مسجد، تعرض فسيفساء مذهلة وقبة ضخمة",
            "description_en": "A masterpiece of Byzantine architecture, now a mosque, showcasing incredible mosaics and massive dome",
            "image": "/images/destinations/global/Istanbul/Istanbul1.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "istanbul-biennial",
            "title_ar": "بينالي إسطنبول",
            "title_en": "Istanbul Biennial",
            "description_ar": "معرض دولي للفن المعاصر يعرض أعمالاً من جميع أنحاء العالم",
            "description_en": "International contemporary art exhibition showcasing works from around the world",
            "date": "2025-09-14",
            "image": "/images/destinations/global/Istanbul/Istanbul3.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 41.0082, "longitude": 28.9784}'::jsonb,
    true
),

-- لندن
(
    'london',
    'لندن',
    'London',
    'مدينة متنوعة تمزج بين التاريخ والحداثة، معروفة بمعالمها الأيقونية ومتاحفها العالمية ومشهدها الثقافي النابض بالحياة',
    'A diverse metropolis blending history and modernity, known for its iconic landmarks, world-class museums, and vibrant cultural scene',
    'لندن الكبرى',
    'Greater London',
    'مدينة',
    'Urban',
    'ثقافي',
    'Cultural',
    '/images/destinations/global/London/London1.jpeg',
    '["/images/destinations/global/London/London1.jpeg", "/images/destinations/global/London/London2.jpeg", "/images/destinations/global/London/London3.jpeg"]'::jsonb,
    '[
        {
            "id": "tower-bridge",
            "name_ar": "جسر البرج",
            "name_en": "Tower Bridge",
            "description_ar": "جسر فيكتوري أيقوني مع ممرات مرتفعة وإطلالات مذهلة على نهر التايمز",
            "description_en": "Iconic Victorian bridge with high-level walkways and stunning views of the Thames",
            "image": "/images/destinations/global/London/London1.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "notting-hill-carnival",
            "title_ar": "كرنفال نوتينج هيل",
            "title_en": "Notting Hill Carnival",
            "description_ar": "أكبر مهرجان شوارع في أوروبا يحتفل بالثقافة والتقاليد الكاريبية",
            "description_en": "Europe''s biggest street festival celebrating Caribbean culture and traditions",
            "date": "2025-08-25",
            "image": "/images/destinations/global/London/London3.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 51.5074, "longitude": -0.1278}'::jsonb,
    true
),

-- مدريد
(
    'madrid',
    'مدريد',
    'Madrid',
    'عاصمة إسبانيا المركزية، مدينة الشوارع الأنيقة والحدائق الواسعة ومتاحف الفن المشهورة عالمياً',
    'Spain''s central capital, a city of elegant boulevards, expansive parks, and world-renowned art museums',
    'مجتمع مدريد',
    'Community of Madrid',
    'مدينة',
    'Urban',
    'ثقافي',
    'Cultural',
    '/images/destinations/global/Madrid/Madrid1.jpeg',
    '["/images/destinations/global/Madrid/Madrid1.jpeg", "/images/destinations/global/Madrid/Madrid2.jpeg", "/images/destinations/global/Madrid/Madrid3.jpeg"]'::jsonb,
    '[
        {
            "id": "prado-museum",
            "name_ar": "متحف برادو",
            "name_en": "Prado Museum",
            "description_ar": "متحف الفن الوطني الإسباني الذي يضم واحدة من أفضل مجموعات الفن الأوروبي",
            "description_en": "Spain''s national art museum housing one of the finest collections of European art",
            "image": "/images/destinations/global/Madrid/Madrid1.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "san-isidro",
            "title_ar": "مهرجان سان إيسيدرو",
            "title_en": "San Isidro Festival",
            "description_ar": "مهرجان تقليدي يكرم قديس مدريد مع الموسيقى والرقص والطعام",
            "description_en": "Traditional festival honoring Madrid''s patron saint with music, dance, and food",
            "date": "2025-05-15",
            "image": "/images/destinations/global/Madrid/Madrid3.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 40.4168, "longitude": -3.7038}'::jsonb,
    false
),

-- المغرب
(
    'morocco',
    'المغرب',
    'Morocco',
    'دولة في شمال أفريقيا تقدم مزيجاً من التأثيرات الثقافية العربية والأمازيغية والأوروبية، وتتميز بالمدن القديمة والصحاري الخلابة والأسواق النابضة بالحياة',
    'A North African country offering a blend of Arab, Berber, and European cultural influences, featuring ancient medinas, stunning deserts, and vibrant markets',
    'شمال أفريقيا',
    'North Africa',
    'متنوع',
    'Diverse',
    'ثقافي',
    'Cultural',
    '/images/destinations/global/Morocco/Morocco1.jpeg',
    '["/images/destinations/global/Morocco/Morocco1.jpeg", "/images/destinations/global/Morocco/Morocco2.jpeg", "/images/destinations/global/Morocco/Morocco3.jpeg"]'::jsonb,
    '[
        {
            "id": "marrakech-medina",
            "name_ar": "مدينة مراكش القديمة",
            "name_en": "Marrakech Medina",
            "description_ar": "موقع تراث عالمي يضم الأسواق التقليدية والقصور وساحة جامع الفنا الشهيرة",
            "description_en": "UNESCO World Heritage site featuring traditional markets, palaces, and the famous Djemaa el-Fna square",
            "image": "/images/destinations/global/Morocco/Morocco1.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "fes-festival",
            "title_ar": "مهرجان فاس للموسيقى الروحية العالمية",
            "title_en": "Fes Festival of World Sacred Music",
            "description_ar": "مهرجان سنوي يحتفي بالموسيقى الروحية من جميع أنحاء العالم",
            "description_en": "Annual festival celebrating spiritual music from around the world",
            "date": "2025-06-14",
            "image": "/images/destinations/global/Morocco/Morocco3.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 31.7917, "longitude": -7.0926}'::jsonb,
    false
),

-- باريس
(
    'paris',
    'باريس',
    'Paris',
    'مدينة النور، مركز عالمي للفن والأزياء والطعام والثقافة، مشهورة بمعالمها الأيقونية وأجوائها الرومانسية',
    'The City of Light, a global center for art, fashion, gastronomy, and culture, famous for its iconic landmarks and romantic atmosphere',
    'إيل دو فرانس',
    'Île-de-France',
    'مدينة',
    'Urban',
    'ثقافي',
    'Cultural',
    '/images/destinations/global/Paris/Paris1.jpeg',
    '["/images/destinations/global/Paris/Paris1.jpeg", "/images/destinations/global/Paris/Paris2.jpeg"]'::jsonb,
    '[
        {
            "id": "eiffel-tower",
            "name_ar": "برج إيفل",
            "name_en": "Eiffel Tower",
            "description_ar": "برج شبكي حديدي أيقوني يوفر إطلالات مذهلة على باريس من منصات المراقبة",
            "description_en": "Iconic iron lattice tower offering stunning views of Paris from its observation decks",
            "image": "/images/destinations/global/Paris/Paris1.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "bastille-day",
            "title_ar": "يوم الباستيل",
            "title_en": "Bastille Day",
            "description_ar": "احتفال وطني يتضمن العروض العسكرية والألعاب النارية والاحتفالات العامة",
            "description_en": "National celebration featuring military parades, fireworks, and public festivities",
            "date": "2025-07-14",
            "image": "/images/destinations/global/Paris/Paris2.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 48.8566, "longitude": 2.3522}'::jsonb,
    true
),

-- شرم الشيخ
(
    'sharm-el-sheikh',
    'شرم الشيخ',
    'Sharm El Sheikh',
    'جنة ساحلية معروفة بشواطئها النقية والشعاب المرجانية النابضة بالحياة ومواقع الغوص العالمية',
    'A coastal paradise known for its pristine beaches, vibrant coral reefs, and world-class diving spots',
    'جنوب سيناء',
    'South Sinai',
    'ساحلي',
    'Coastal',
    'شاطئ',
    'Beach',
    '/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg',
    '["/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg", "/images/destinations/global/SharmElSheikh/SharmElSheikh2.jpeg"]'::jsonb,
    '[
        {
            "id": "naama-bay",
            "name_ar": "خليج نعمة",
            "name_en": "Naama Bay",
            "description_ar": "مركز سياحي نابض بالحياة مع ممشى مصطف بأشجار النخيل ومطاعم ومراكز غوص",
            "description_en": "Vibrant tourist hub with a palm tree-lined promenade, restaurants, and diving centers",
            "image": "/images/destinations/global/SharmElSheikh/SharmElSheikh2.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "diving-festival",
            "title_ar": "مهرجان الغوص الدولي",
            "title_en": "International Diving Festival",
            "description_ar": "مهرجان سنوي يحتفي بجمال البحر الأحمر تحت الماء",
            "description_en": "Annual festival celebrating the underwater beauty of the Red Sea",
            "date": "2025-05-20",
            "image": "/images/destinations/global/SharmElSheikh/SharmElSheikh1.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 27.9158, "longitude": 34.3300}'::jsonb,
    false
),

-- تايلاند
(
    'thailand',
    'تايلاند',
    'Thailand',
    'دولة في جنوب شرق آسيا معروفة بشواطئها الاستوائية والقصور الملكية الفخمة والآثار القديمة والمعابد المزخرفة التي تعرض تماثيل بوذا',
    'Southeast Asian country known for tropical beaches, opulent royal palaces, ancient ruins, and ornate temples displaying figures of Buddha',
    'جنوب شرق آسيا',
    'Southeast Asia',
    'متنوع',
    'Diverse',
    'ثقافي',
    'Cultural',
    '/images/destinations/global/Thailand/Thailand1.jpeg',
    '["/images/destinations/global/Thailand/Thailand1.jpeg", "/images/destinations/global/Thailand/Thailand2.jpeg", "/images/destinations/global/Thailand/Thailand3.jpeg"]'::jsonb,
    '[
        {
            "id": "grand-palace",
            "name_ar": "القصر الكبير",
            "name_en": "Grand Palace",
            "description_ar": "المقر السابق لملوك تايلاند، يتميز بهندسة معمارية مذهلة ومعابد مقدسة",
            "description_en": "Former residence of Thai kings, featuring stunning architecture and sacred temples",
            "image": "/images/destinations/global/Thailand/Thailand1.jpeg"
        }
    ]'::jsonb,
    '[
        {
            "id": "songkran",
            "title_ar": "مهرجان سونكران",
            "title_en": "Songkran Festival",
            "description_ar": "احتفال رأس السنة التايلاندية يتميز بمعارك المياه والطقوس التقليدية",
            "description_en": "Thai New Year celebration featuring water fights and traditional ceremonies",
            "date": "2025-04-13",
            "image": "/images/destinations/global/Thailand/Thailand3.jpeg"
        }
    ]'::jsonb,
    '{"latitude": 15.8700, "longitude": 100.9925}'::jsonb,
    true
);

-- 4. إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_destinations_featured ON destinations(featured);
CREATE INDEX IF NOT EXISTS idx_destinations_region_ar ON destinations(region_ar);
CREATE INDEX IF NOT EXISTS idx_destinations_region_en ON destinations(region_en);
CREATE INDEX IF NOT EXISTS idx_destinations_destination_type_ar ON destinations(destination_type_ar);
CREATE INDEX IF NOT EXISTS idx_destinations_destination_type_en ON destinations(destination_type_en);

-- 5. إضافة تعليقات على الجدول والأعمدة
COMMENT ON TABLE destinations IS 'جدول الوجهات السياحية - السعودية والعالمية';
COMMENT ON COLUMN destinations.id IS 'معرف فريد للوجهة';
COMMENT ON COLUMN destinations.name_ar IS 'اسم الوجهة باللغة العربية';
COMMENT ON COLUMN destinations.name_en IS 'اسم الوجهة باللغة الإنجليزية';
COMMENT ON COLUMN destinations.description_ar IS 'وصف الوجهة باللغة العربية';
COMMENT ON COLUMN destinations.description_en IS 'وصف الوجهة باللغة الإنجليزية';
COMMENT ON COLUMN destinations.region_ar IS 'المنطقة باللغة العربية';
COMMENT ON COLUMN destinations.region_en IS 'المنطقة باللغة الإنجليزية';
COMMENT ON COLUMN destinations.location_type_ar IS 'نوع الموقع باللغة العربية';
COMMENT ON COLUMN destinations.location_type_en IS 'نوع الموقع باللغة الإنجليزية';
COMMENT ON COLUMN destinations.destination_type_ar IS 'نوع الوجهة باللغة العربية';
COMMENT ON COLUMN destinations.destination_type_en IS 'نوع الوجهة باللغة الإنجليزية';
COMMENT ON COLUMN destinations.main_image IS 'الصورة الرئيسية للوجهة';
COMMENT ON COLUMN destinations.gallery IS 'معرض الصور (JSON)';
COMMENT ON COLUMN destinations.tourist_spots IS 'الأماكن السياحية (JSON)';
COMMENT ON COLUMN destinations.upcoming_events IS 'الفعاليات القادمة (JSON)';
COMMENT ON COLUMN destinations.coordinates IS 'الإحداثيات الجغرافية (JSON)';
COMMENT ON COLUMN destinations.featured IS 'هل الوجهة مميزة؟';

-- 6. التحقق من البيانات المدخلة
SELECT 
    id,
    name_ar,
    name_en,
    region_ar,
    destination_type_ar,
    featured,
    created_at
FROM destinations 
ORDER BY featured DESC, created_at ASC;
