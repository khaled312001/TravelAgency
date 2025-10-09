# إعداد نظام فورم التواصل والحجز

## نظرة عامة
تم إضافة نظام شامل لإدارة طلبات التواصل والحجز في الموقع، يتضمن:

1. **فورم التواصل في الصفحة الرئيسية** - قسم جديد للتواصل مع العملاء
2. **فورم التواصل في صفحات البكجات** - فورم مخصص لكل باقة سفر
3. **API endpoints** - لحفظ وإدارة البيانات
4. **لوحة إدارة الرسائل** - لعرض وإدارة طلبات التواصل

## الملفات المضافة/المحدثة

### 1. API Endpoints
- `server/api/contact.post.ts` - لحفظ رسائل التواصل
- `server/api/admin/contact-messages/index.get.ts` - لجلب الرسائل في لوحة الإدارة
- `server/api/admin/contact-messages/[id].put.ts` - لتحديث حالة الرسائل
- `server/api/admin/contact-messages/[id].delete.ts` - لحذف الرسائل

### 2. المكونات
- `components/HomeSections/ContactSection.vue` - قسم التواصل في الصفحة الرئيسية
- `components/ContactForm.vue` - محدث لإرسال البيانات إلى API
- `components/ui/modals/PackageContactFormModal.vue` - محدث لحفظ البيانات

### 3. الصفحات
- `pages/index.vue` - محدث لإضافة قسم التواصل
- `pages/admin/messages/index.vue` - محدث لاستخدام API الجديد

### 4. قاعدة البيانات
- `update-contact-messages-table.sql` - تحديث جدول contact_messages

## خطوات الإعداد

### 1. تحديث قاعدة البيانات
قم بتشغيل ملف SQL التالي في قاعدة البيانات:

```sql
-- تحديث جدول contact_messages لإضافة الحقول المطلوبة
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'inquiry',
ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS package_name VARCHAR(255);

-- تحديث الحقول الموجودة
ALTER TABLE contact_messages 
ALTER COLUMN name TYPE VARCHAR(255),
ALTER COLUMN email TYPE VARCHAR(255),
ALTER COLUMN phone TYPE VARCHAR(50),
ALTER COLUMN subject TYPE VARCHAR(255),
ALTER COLUMN message TYPE TEXT,
ALTER COLUMN status SET DEFAULT 'unread';

-- إضافة فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_type ON contact_messages(type);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_package_id ON contact_messages(package_id);
```

### 2. متغيرات البيئة
تأكد من وجود المتغيرات التالية في ملف `.env`:

```env
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. تشغيل المشروع
```bash
npm run dev
```

## الميزات

### فورم التواصل في الصفحة الرئيسية
- معلومات التواصل (هاتف، إيميل، عنوان، ساعات العمل)
- فورم شامل للتواصل
- زر واتساب مباشر
- رسائل نجاح وخطأ

### فورم التواصل في صفحات البكجات
- فورم مخصص لكل باقة
- حفظ البيانات في قاعدة البيانات
- إرسال إشعار واتساب
- ربط الرسالة بالباقة المحددة

### لوحة إدارة الرسائل
- عرض جميع الرسائل
- فلترة حسب الحالة والنوع
- بحث في الرسائل
- تحديث حالة الرسائل
- حذف الرسائل
- إحصائيات الرسائل

## أنواع الرسائل
- `inquiry` - استفسار عام
- `booking` - طلب حجز باقة
- `complaint` - شكوى
- `suggestion` - اقتراح

## حالات الرسائل
- `unread` - غير مقروء
- `read` - مقروء
- `replied` - مجاب
- `pending` - في الانتظار

## API Endpoints

### إرسال رسالة تواصل
```
POST /api/contact
```

Body:
```json
{
  "name": "اسم العميل",
  "email": "email@example.com",
  "phone": "+966501234567",
  "message": "نص الرسالة",
  "subject": "موضوع الرسالة (اختياري)",
  "type": "inquiry",
  "package_id": "uuid (اختياري)",
  "package_name": "اسم الباقة (اختياري)"
}
```

### جلب الرسائل (لوحة الإدارة)
```
GET /api/admin/contact-messages?status=unread&type=inquiry&search=نص البحث
```

### تحديث حالة الرسالة
```
PUT /api/admin/contact-messages/{id}
```

Body:
```json
{
  "status": "read"
}
```

### حذف الرسالة
```
DELETE /api/admin/contact-messages/{id}
```

## الاختبار

### اختبار فورم التواصل
1. اذهب إلى الصفحة الرئيسية
2. انتقل إلى قسم "تواصل معنا"
3. املأ الفورم وأرسله
4. تحقق من ظهور الرسالة في لوحة الإدارة

### اختبار فورم البكجات
1. اذهب إلى أي صفحة باقة
2. اضغط على "تواصل معنا للحجز"
3. املأ الفورم وأرسله
4. تحقق من ظهور الرسالة في لوحة الإدارة مع ربطها بالباقة

### اختبار لوحة الإدارة
1. اذهب إلى `/admin/messages`
2. تحقق من عرض الرسائل
3. جرب الفلترة والبحث
4. جرب تحديث وحذف الرسائل

## ملاحظات مهمة

1. **الأمان**: تأكد من حماية API endpoints في الإنتاج
2. **التحقق**: جميع الحقول المطلوبة يتم التحقق منها
3. **الأداء**: تم إضافة فهارس لتحسين أداء الاستعلامات
4. **التوافق**: النظام متوافق مع اللغتين العربية والإنجليزية
5. **الاستجابة**: جميع المكونات متجاوبة مع الأجهزة المختلفة

## استكشاف الأخطاء

### مشاكل قاعدة البيانات
- تأكد من تشغيل ملف SQL التحديث
- تحقق من صحة متغيرات البيئة
- تأكد من وجود الجدول `contact_messages`

### مشاكل API
- تحقق من logs الخادم
- تأكد من صحة البيانات المرسلة
- تحقق من صلاحيات قاعدة البيانات

### مشاكل الواجهة
- تحقق من console المتصفح للأخطاء
- تأكد من تحميل المكونات بشكل صحيح
- تحقق من صحة الترجمات
