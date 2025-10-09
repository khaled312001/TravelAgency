# إعداد قاعدة البيانات النهائي لفورم التواصل

## ✅ ما تم إنجازه

تم إنشاء نظام فورم التواصل والحجز بنجاح! جميع الملفات والكود جاهز للاستخدام.

## 🔧 ما يحتاج إعداد يدوي

الجدول `contact_messages` موجود في قاعدة البيانات، ولكن يحتاج إضافة بعض الحقول الجديدة.

### الخطوة الوحيدة المطلوبة:

**اذهب إلى Supabase Dashboard واشغل SQL التالي:**

1. اذهب إلى مشروع Supabase الخاص بك
2. اضغط على "SQL Editor" في القائمة الجانبية
3. انسخ والصق الكود التالي:

```sql
-- إضافة الحقول الجديدة
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'inquiry';
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES packages(id) ON DELETE SET NULL;
ALTER TABLE contact_messages ADD COLUMN IF NOT EXISTS package_name VARCHAR(255);

-- تحديث الحقول الموجودة
ALTER TABLE contact_messages ALTER COLUMN name TYPE VARCHAR(255);
ALTER TABLE contact_messages ALTER COLUMN email TYPE VARCHAR(255);
ALTER TABLE contact_messages ALTER COLUMN phone TYPE VARCHAR(50);
ALTER TABLE contact_messages ALTER COLUMN subject TYPE VARCHAR(255);
ALTER TABLE contact_messages ALTER COLUMN message TYPE TEXT;
ALTER TABLE contact_messages ALTER COLUMN status SET DEFAULT 'unread';

-- إضافة فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_type ON contact_messages(type);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_package_id ON contact_messages(package_id);
```

4. اضغط على "Run" لتنفيذ الكود

## 🎉 بعد تنفيذ SQL

بمجرد تنفيذ SQL أعلاه، سيكون النظام جاهز بالكامل!

### اختبار النظام:

1. **فورم التواصل في الصفحة الرئيسية:**
   - اذهب إلى الصفحة الرئيسية
   - انتقل إلى قسم "تواصل معنا"
   - املأ الفورم وأرسله

2. **فورم التواصل في صفحات البكجات:**
   - اذهب إلى أي صفحة باقة
   - اضغط على "تواصل معنا للحجز"
   - املأ الفورم وأرسله

3. **لوحة الإدارة:**
   - اذهب إلى `/admin/messages`
   - تحقق من ظهور الرسائل
   - جرب الفلترة والبحث

## 📁 الملفات المضافة

### API Endpoints:
- `server/api/contact.post.ts` - لحفظ رسائل التواصل
- `server/api/admin/contact-messages/index.get.ts` - لجلب الرسائل
- `server/api/admin/contact-messages/[id].put.ts` - لتحديث الرسائل
- `server/api/admin/contact-messages/[id].delete.ts` - لحذف الرسائل

### المكونات:
- `components/HomeSections/ContactSection.vue` - قسم التواصل في الصفحة الرئيسية
- `components/ContactForm.vue` - محدث لإرسال البيانات
- `components/ui/modals/PackageContactFormModal.vue` - محدث لحفظ البيانات

### الصفحات:
- `pages/index.vue` - محدث لإضافة قسم التواصل
- `pages/admin/messages/index.vue` - محدث لاستخدام API الجديد

### الترجمات:
- `locales/ar-SA.json` - محدث بالترجمات العربية
- `locales/en-US.json` - محدث بالترجمات الإنجليزية

### السكريبتات:
- `test-database-connection.js` - اختبار الاتصال
- `setup-contact-database.js` - إعداد قاعدة البيانات
- `create-new-table.js` - اختبار الجدول
- `update-table-direct.sql` - SQL للتحديث اليدوي

## 🔍 التحقق من النجاح

بعد تنفيذ SQL، يمكنك التحقق من النجاح بتشغيل:

```bash
node test-database-connection.js
```

يجب أن ترى:
```
✅ الاتصال ناجح!
✅ جدول contact_messages موجود
🎉 كل شيء يعمل بشكل صحيح!
```

## 🚀 تشغيل المشروع

```bash
npm run dev
```

## 📊 الميزات المتاحة

### فورم التواصل في الصفحة الرئيسية:
- معلومات التواصل (هاتف، إيميل، عنوان، ساعات العمل)
- فورم شامل للتواصل
- زر واتساب مباشر
- رسائل نجاح وخطأ

### فورم التواصل في صفحات البكجات:
- فورم مخصص لكل باقة
- حفظ البيانات في قاعدة البيانات
- إرسال إشعار واتساب
- ربط الرسالة بالباقة المحددة

### لوحة إدارة الرسائل:
- عرض جميع الرسائل
- فلترة حسب الحالة والنوع
- بحث في الرسائل
- تحديث حالة الرسائل
- حذف الرسائل
- إحصائيات الرسائل

## 🎯 أنواع الرسائل

- `inquiry` - استفسار عام
- `booking` - طلب حجز باقة
- `complaint` - شكوى
- `suggestion` - اقتراح

## 📈 حالات الرسائل

- `unread` - غير مقروء
- `read` - مقروء
- `replied` - مجاب
- `pending` - في الانتظار

## 🔒 الأمان

- جميع الحقول المطلوبة يتم التحقق منها
- حماية من SQL injection
- تشفير البيانات الحساسة
- صلاحيات محددة للوصول

## 📱 التوافق

- متوافق مع جميع الأجهزة
- دعم اللغتين العربية والإنجليزية
- تصميم متجاوب
- سرعة تحميل عالية

## 🆘 الدعم

إذا واجهت أي مشاكل:

1. تحقق من logs الخادم
2. تأكد من تنفيذ SQL بنجاح
3. تحقق من متغيرات البيئة
4. راجع وثائق Supabase

---

**🎉 النظام جاهز للاستخدام بعد تنفيذ SQL أعلاه!**
