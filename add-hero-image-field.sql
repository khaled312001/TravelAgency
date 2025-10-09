-- =============================================
-- إضافة حقل hero_image_url لجدول packages
-- =============================================

-- 1. إضافة الحقل الجديد
ALTER TABLE packages 
ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

-- 2. تحديث البيانات الموجودة لاستخدام نفس مسار الصورة الأساسية
UPDATE packages 
SET hero_image_url = image_url 
WHERE hero_image_url IS NULL;

-- 3. إضافة قيود للحقل الجديد (اختياري)
ALTER TABLE packages 
ALTER COLUMN hero_image_url SET NOT NULL;

-- 4. إضافة تعليق للحقل
COMMENT ON COLUMN packages.hero_image_url IS 'صورة الهيرو للباقة - تستخدم في الصفحة الرئيسية';

-- 5. التحقق من النتائج
SELECT 
    id,
    title_ar,
    title_en,
    image_url,
    hero_image_url,
    featured
FROM packages 
ORDER BY created_at DESC;
