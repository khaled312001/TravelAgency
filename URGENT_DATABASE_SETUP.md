# 🚨 إعداد عاجل لقاعدة البيانات

## ⚠️ المشكلة الحالية
خطأ 500 عند محاولة الحفظ - جدول قاعدة البيانات غير موجود

## 🔧 الحل العاجل

### الخطوة 1: إنشاء جدول قاعدة البيانات

1. **اذهب إلى Supabase Dashboard**: https://supabase.com/dashboard
2. **اختر مشروعك**: `ueofktshvaqtxjsxvisv`
3. **اضغط على "SQL Editor"**
4. **انسخ والصق الكود التالي**:

```sql
CREATE TABLE IF NOT EXISTS site_content (
  id SERIAL PRIMARY KEY,
  page VARCHAR(100) NOT NULL UNIQUE,
  content JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_site_content_page ON site_content(page);

INSERT INTO site_content (page, content) VALUES (
  'homepage',
  '{
    "hero": {
      "title": {
        "ar": "نحنُ نأخذك إلى أفضل الأماكن حول العالم",
        "en": "We take you to the best places around the world"
      },
      "subtitle": {
        "ar": "باقات سفر شاملة تناسب جميع الميزانيات. وجهتك المثالية تبدأ معنا!",
        "en": "All-inclusive travel packages to suit every budget. Your perfect destination starts with us!"
      },
      "cta": {
        "ar": "استكشف باقاتنا",
        "en": "Explore Our Packages"
      },
      "video_desktop": "/videos/hero/desktop/hero-desktop.webm",
      "video_mobile": "/videos/hero/mobile/hero-mobile-center.webm",
      "poster_image": "/images/home/heroSection/hero-image.webp"
    },
    "search": {
      "title": {
        "ar": "ابحث عن رحلتك المثالية",
        "en": "Find Your Perfect Package"
      },
      "description": {
        "ar": "اكتشف باقات سفر مذهلة مصممة حسب تفضيلاتك",
        "en": "Discover amazing travel packages tailored to your preferences"
      }
    },
    "services": {
      "title": {
        "ar": "خدماتنا المميزة",
        "en": "Our Premium Services"
      },
      "subtitle": {
        "ar": "استمتع بتجربة سفر سلسة مع مجموعة خدماتنا المميزة المصممة لجعل رحلتك استثنائية",
        "en": "Experience seamless travel with our comprehensive range of premium services designed to make your journey extraordinary"
      },
      "description": {
        "ar": "رحلة أحلامك هي شغفنا. نبذل قصارى جهدنا لتصميم تجارب سفر لا تُنسى، ونهتم بكل التفاصيل حتى تتمكن من التركيز على صنع ذكريات جميلة.",
        "en": "Your dream journey is our passion. We go above and beyond to craft unforgettable travel experiences, taking care of every detail so you can focus on creating beautiful memories."
      }
    },
    "destinations": {
      "saudi": {
        "title": {
          "ar": "اكتشف روعة المملكة",
          "en": "Discover Saudi Arabia"
        },
        "subtitle": {
          "ar": "رحلة استثنائية عبر التراث العريق والحضارة المعاصرة والطبيعة الخلابة",
          "en": "Embark on an extraordinary journey through ancient traditions, modern marvels, and breathtaking landscapes"
        }
      },
      "global": {
        "title": {
          "ar": "وجهات عالمية فاخرة",
          "en": "World-Class Destinations"
        },
        "subtitle": {
          "ar": "عش تجارب لا تُنسى في أروع الوجهات حول العالم",
          "en": "Experience unforgettable adventures in the most spectacular places around the globe"
        }
      }
    }
  }'::jsonb
) ON CONFLICT (page) DO NOTHING;

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_site_content_updated_at ON site_content;
CREATE TRIGGER update_site_content_updated_at
    BEFORE UPDATE ON site_content
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

5. **اضغط على "Run"**

### الخطوة 2: التحقق من الجدول

1. **اذهب إلى "Table Editor"**
2. **تأكد من وجود جدول `site_content`**
3. **تأكد من وجود سجل واحد مع `page = 'homepage'`**

### الخطوة 3: اختبار النظام

1. **اذهب إلى**: `https://www.worldtripagency.com/admin/content`
2. **سجل الدخول**: `info@worldtripagency.com` / `admin123`
3. **عدّل أي نص**
4. **اضغط على "حفظ جميع التغييرات"**
5. **تأكد من عدم ظهور خطأ 500**

## 🎯 النتيجة المتوقعة:

- ✅ سيختفي خطأ 500
- ✅ ستعمل وظيفة الحفظ
- ✅ سيتم حفظ التغييرات في قاعدة البيانات
- ✅ ستظهر التغييرات عند إعادة فتح الصفحة

## 📞 إذا لم يعمل:

1. تأكد من نسخ الكود كاملاً
2. تأكد من الضغط على "Run"
3. تأكد من ظهور الجدول في "Table Editor"
4. تأكد من وجود سجل واحد في الجدول

**🚨 هذا الإعداد ضروري لعمل النظام!**
