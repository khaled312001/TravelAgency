-- =============================================
-- إضافة عمود data لجدول notifications
-- =============================================

-- إضافة عمود data من نوع JSONB
ALTER TABLE notifications 
ADD COLUMN IF NOT EXISTS data JSONB;

-- إضافة تعليق على العمود
COMMENT ON COLUMN notifications.data IS 'بيانات إضافية للإشعار (JSON)';

-- التحقق من النتائج
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'notifications' 
ORDER BY ordinal_position;
