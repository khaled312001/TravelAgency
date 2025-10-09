# تعليمات إعداد قاعدة البيانات لفورم التواصل

## الخطوات المطلوبة

### 1. تثبيت التبعيات
```bash
# نسخ ملف package.json للتبعيات
cp package-database.json package.json

# تثبيت التبعيات
npm install
```

### 2. إعداد متغيرات البيئة
أنشئ ملف `.env` في المجلد الجذر وأضف:

```env
SUPABASE_URL=https://ueofktshvaqtxjsxvisv.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

**ملاحظة مهمة:** استبدل `your_service_role_key_here` بمفتاح service_role الصحيح من مشروع Supabase الخاص بك.

### 3. تشغيل السكريبتات

#### اختبار الاتصال أولاً:
```bash
node test-database-connection.js
```

#### إعداد قاعدة البيانات:
```bash
node setup-contact-database.js
```

#### أو استخدام السكريبتات البديلة:
```bash
# السكريبت البسيط
node update-database-simple.js

# السكريبت باستخدام REST API
node update-database-rest.js
```

## السكريبتات المتاحة

### 1. `test-database-connection.js`
- اختبار الاتصال بقاعدة البيانات
- التحقق من وجود الجداول
- اختبار أساسي للعمليات

### 2. `setup-contact-database.js`
- السكريبت الشامل لإعداد قاعدة البيانات
- إنشاء الجدول إذا لم يكن موجوداً
- إضافة الحقول الجديدة
- اختبار النظام

### 3. `update-database-simple.js`
- تحديث قاعدة البيانات بطريقة بسيطة
- إضافة الحقول الجديدة
- تحديث أنواع البيانات
- إضافة الفهارس

### 4. `update-database-rest.js`
- استخدام REST API لتحديث قاعدة البيانات
- إنشاء الجدول إذا لم يكن موجوداً
- اختبار العمليات

## ما يتم تنفيذه

### 1. إنشاء/تحديث جدول `contact_messages`
```sql
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50),
  subject VARCHAR(255),
  message TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'unread',
  type VARCHAR(50) DEFAULT 'inquiry',
  package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
  package_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. إضافة الحقول الجديدة
- `type` - نوع الرسالة (inquiry, booking, complaint, suggestion)
- `package_id` - معرف الباقة المرتبطة
- `package_name` - اسم الباقة

### 3. إضافة الفهارس
- فهرس على `status`
- فهرس على `type`
- فهرس على `created_at`
- فهرس على `package_id`

## استكشاف الأخطاء

### خطأ في الاتصال
```
❌ خطأ في الاتصال: Invalid API key
```
**الحل:** تحقق من صحة `SUPABASE_SERVICE_ROLE_KEY`

### خطأ في إنشاء الجدول
```
❌ خطأ في إنشاء الجدول: permission denied
```
**الحل:** تأكد من استخدام service_role key وليس anon key

### خطأ في الحقول
```
⚠️ حقل type غير موجود أو يحتاج تحديث
```
**الحل:** الجدول موجود ولكن يحتاج تحديث، استخدم `update-database-simple.js`

## التحقق من النجاح

بعد تشغيل السكريبت بنجاح، يجب أن ترى:

```
🎉 تم إعداد قاعدة البيانات بنجاح!
📝 يمكنك الآن استخدام نظام فورم التواصل والحجز
```

## اختبار النظام

### 1. اختبار فورم التواصل في الصفحة الرئيسية
- اذهب إلى الصفحة الرئيسية
- انتقل إلى قسم "تواصل معنا"
- املأ الفورم وأرسله
- تحقق من ظهور الرسالة في لوحة الإدارة

### 2. اختبار فورم البكجات
- اذهب إلى أي صفحة باقة
- اضغط على "تواصل معنا للحجز"
- املأ الفورم وأرسله
- تحقق من ظهور الرسالة مع ربطها بالباقة

### 3. اختبار لوحة الإدارة
- اذهب إلى `/admin/messages`
- تحقق من عرض الرسائل
- جرب الفلترة والبحث
- جرب تحديث وحذف الرسائل

## ملاحظات مهمة

1. **الأمان:** لا تشارك service_role key مع أي شخص
2. **النسخ الاحتياطي:** قم بعمل نسخة احتياطية من قاعدة البيانات قبل التحديث
3. **الاختبار:** اختبر النظام في بيئة التطوير قبل النشر
4. **المراقبة:** راقب logs الخادم للتأكد من عمل النظام بشكل صحيح

## الدعم

إذا واجهت أي مشاكل:

1. تحقق من logs السكريبت
2. تأكد من صحة متغيرات البيئة
3. تحقق من صلاحيات قاعدة البيانات
4. راجع وثائق Supabase

## الملفات المطلوبة

- `test-database-connection.js` - اختبار الاتصال
- `setup-contact-database.js` - الإعداد الشامل
- `update-database-simple.js` - التحديث البسيط
- `update-database-rest.js` - التحديث باستخدام REST API
- `package-database.json` - التبعيات المطلوبة
- `.env` - متغيرات البيئة (أنشئه بنفسك)
