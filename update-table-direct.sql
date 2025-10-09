-- تحديث جدول contact_messages لإضافة الحقول المطلوبة
-- قم بتشغيل هذا السكريبت في Supabase SQL Editor

-- إضافة الحقول الجديدة
ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS type VARCHAR(50) DEFAULT 'inquiry';

ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES packages(id) ON DELETE SET NULL;

ALTER TABLE contact_messages 
ADD COLUMN IF NOT EXISTS package_name VARCHAR(255);

-- تحديث الحقول الموجودة
ALTER TABLE contact_messages 
ALTER COLUMN name TYPE VARCHAR(255);

ALTER TABLE contact_messages 
ALTER COLUMN email TYPE VARCHAR(255);

ALTER TABLE contact_messages 
ALTER COLUMN phone TYPE VARCHAR(50);

ALTER TABLE contact_messages 
ALTER COLUMN subject TYPE VARCHAR(255);

ALTER TABLE contact_messages 
ALTER COLUMN message TYPE TEXT;

ALTER TABLE contact_messages 
ALTER COLUMN status SET DEFAULT 'unread';

-- إضافة فهرس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_type ON contact_messages(type);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_package_id ON contact_messages(package_id);

-- التحقق من النتيجة
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'contact_messages' 
ORDER BY ordinal_position;
