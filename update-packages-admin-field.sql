-- إضافة حقل created_by_admin لجدول packages
-- هذا الحقل يميز الباقات التي تم إنشاؤها من لوحة الإدارة

-- إضافة الحقل الجديد
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS created_by_admin BOOLEAN DEFAULT FALSE;

-- تحديث الباقات الموجودة لتكون غير محددة كمصدر (false)
-- يمكنك تغيير هذا لاحقاً حسب الحاجة
UPDATE packages 
SET created_by_admin = FALSE 
WHERE created_by_admin IS NULL;

-- إنشاء فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_packages_created_by_admin 
ON packages(created_by_admin);

-- إنشاء فهرس مركب للاستعلامات الشائعة
CREATE INDEX IF NOT EXISTS idx_packages_admin_featured 
ON packages(created_by_admin, featured);

-- تعليق: بعد تشغيل هذا الملف، ستظهر فقط الباقات التي تم إنشاؤها من لوحة الإدارة
-- في صفحة الباقات وقسم الباقات في الصفحة الرئيسية
