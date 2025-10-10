# 🎨 نظام إدارة المحتوى - دليل الإعداد والاستخدام

## ✅ ما تم إنجازه

تم إنشاء نظام إدارة محتوى شامل يسمح بتعديل النصوص والعناوين في الصفحة الرئيسية باللغتين العربية والإنجليزية.

### 🏗️ المكونات المُنشأة

#### 1. **صفحة إدارة المحتوى**
- `pages/admin/content/index.vue` - واجهة إدارة المحتوى
- تصميم متجاوب مع دعم اللغتين العربية والإنجليزية
- أقسام منفصلة لكل جزء من الصفحة الرئيسية

#### 2. **API Endpoints**
- `server/api/admin/content/index.get.ts` - استرجاع المحتوى
- `server/api/admin/content/index.post.ts` - حفظ المحتوى

#### 3. **قاعدة البيانات**
- `create-site-content-table.sql` - جدول `site_content`
- دعم JSONB لتخزين المحتوى المرن
- محتوى افتراضي باللغتين العربية والإنجليزية

#### 4. **Composable**
- `composables/useSiteContent.ts` - إدارة المحتوى التفاعلي
- دعم fallback للترجمات الافتراضية

#### 5. **تحديث المكونات**
- `components/HomeSections/HeroSection.vue`
- `components/HomeSections/searchSection.vue`
- `components/HomeSections/servicesSection.vue`
- `components/HomeSections/saudiDestinations.vue`
- `components/HomeSections/globalDestinations.vue`

## 🚀 خطوات الإعداد

### 1. **إنشاء جدول قاعدة البيانات**

```bash
# تشغيل ملف SQL لإنشاء الجدول
psql -d your_database -f create-site-content-table.sql
```

أو استخدم Supabase Dashboard:
1. اذهب إلى SQL Editor
2. انسخ محتوى `create-site-content-table.sql`
3. شغل الاستعلام

### 2. **تحديث متغيرات البيئة**

تأكد من وجود المتغيرات التالية في `.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. **تشغيل المشروع**

```bash
npm run dev
```

## 📱 كيفية الاستخدام

### 1. **الوصول لصفحة إدارة المحتوى**

1. اذهب إلى: `http://localhost:3000/admin/login`
2. سجل الدخول بالبيانات:
   - البريد: `admin@wonderland.com`
   - كلمة المرور: `admin123`
3. اضغط على "إدارة المحتوى" في القائمة الجانبية

### 2. **تعديل المحتوى**

#### قسم البطل الرئيسي (Hero Section)
- **العنوان الرئيسي**: النص الكبير في أعلى الصفحة
- **النص الفرعي**: الوصف تحت العنوان
- **نص الزر**: نص زر "استكشف باقاتنا"

#### قسم البحث (Search Section)
- **عنوان البحث**: "ابحث عن رحلتك المثالية"
- **وصف البحث**: النص التوضيحي تحت العنوان

#### قسم الخدمات (Services Section)
- **عنوان الخدمات**: "خدماتنا المميزة"
- **النص الفرعي**: النص الصغير فوق العنوان
- **وصف الخدمات**: النص التوضيحي الطويل

#### قسم الوجهات (Destinations Section)
- **الوجهات السعودية**: العنوان والوصف
- **الوجهات العالمية**: العنوان والوصف

### 3. **حفظ التغييرات**

1. عدّل النصوص في الحقول المطلوبة
2. اضغط على "حفظ جميع التغييرات"
3. ستظهر رسالة نجاح في الأعلى

## 🔧 الميزات التقنية

### 1. **دعم اللغتين**
- كل حقل له نسختان: عربية وإنجليزية
- التبديل التلقائي حسب لغة الموقع
- Fallback للترجمات الافتراضية

### 2. **التصميم المتجاوب**
- يعمل على جميع الأجهزة
- واجهة سهلة الاستخدام
- ألوان مميزة لكل لغة

### 3. **الأمان**
- حماية بـ middleware الإدارة
- تشفير البيانات في قاعدة البيانات
- التحقق من الصلاحيات

### 4. **الأداء**
- تحميل المحتوى مرة واحدة
- Cache للبيانات
- تحديث فوري للواجهة

## 📊 هيكل البيانات

```json
{
  "hero": {
    "title": { "ar": "العنوان العربي", "en": "English Title" },
    "subtitle": { "ar": "النص الفرعي العربي", "en": "English Subtitle" },
    "cta": { "ar": "نص الزر العربي", "en": "English Button Text" }
  },
  "search": {
    "title": { "ar": "عنوان البحث العربي", "en": "English Search Title" },
    "description": { "ar": "وصف البحث العربي", "en": "English Search Description" }
  },
  "services": {
    "title": { "ar": "عنوان الخدمات العربي", "en": "English Services Title" },
    "subtitle": { "ar": "النص الفرعي للخدمات", "en": "English Services Subtitle" },
    "description": { "ar": "وصف الخدمات العربي", "en": "English Services Description" }
  },
  "destinations": {
    "saudi": {
      "title": { "ar": "عنوان الوجهات السعودية", "en": "English Saudi Destinations Title" },
      "subtitle": { "ar": "وصف الوجهات السعودية", "en": "English Saudi Destinations Description" }
    },
    "global": {
      "title": { "ar": "عنوان الوجهات العالمية", "en": "English Global Destinations Title" },
      "subtitle": { "ar": "وصف الوجهات العالمية", "en": "English Global Destinations Description" }
    }
  }
}
```

## 🎯 النتيجة النهائية

تم إنشاء نظام إدارة محتوى متكامل يتيح:

- ✅ **تعديل النصوص** في الصفحة الرئيسية
- ✅ **دعم اللغتين** العربية والإنجليزية
- ✅ **واجهة سهلة الاستخدام** في لوحة الإدارة
- ✅ **حفظ فوري** للتغييرات
- ✅ **تصميم متجاوب** يعمل على جميع الأجهزة
- ✅ **أمان عالي** مع حماية الصفحات
- ✅ **أداء محسن** مع cache للبيانات

🎉 **النظام جاهز للاستخدام!**
