-- =============================================
-- إنشاء جدول رسائل التواصل
-- =============================================

-- 1. إنشاء جدول contact_messages
CREATE TABLE IF NOT EXISTS contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    subject VARCHAR(500) DEFAULT 'رسالة تواصل',
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    type VARCHAR(50) DEFAULT 'inquiry' CHECK (type IN ('inquiry', 'complaint', 'suggestion', 'booking', 'other')),
    package_id UUID REFERENCES packages(id) ON DELETE SET NULL,
    package_name VARCHAR(255),
    admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
    admin_reply TEXT,
    admin_reply_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. إنشاء فهارس لتحسين الأداء
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_type ON contact_messages(type);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_package_id ON contact_messages(package_id);

-- 3. إضافة تعليقات على الجدول والأعمدة
COMMENT ON TABLE contact_messages IS 'جدول رسائل التواصل من العملاء';
COMMENT ON COLUMN contact_messages.id IS 'معرف فريد للرسالة';
COMMENT ON COLUMN contact_messages.name IS 'اسم المرسل';
COMMENT ON COLUMN contact_messages.email IS 'البريد الإلكتروني للمرسل';
COMMENT ON COLUMN contact_messages.phone IS 'رقم الهاتف (اختياري)';
COMMENT ON COLUMN contact_messages.subject IS 'موضوع الرسالة';
COMMENT ON COLUMN contact_messages.message IS 'محتوى الرسالة';
COMMENT ON COLUMN contact_messages.status IS 'حالة الرسالة: unread, read, replied, archived';
COMMENT ON COLUMN contact_messages.type IS 'نوع الرسالة: inquiry, complaint, suggestion, booking, other';
COMMENT ON COLUMN contact_messages.package_id IS 'معرف الباقة المرتبطة (إن وجدت)';
COMMENT ON COLUMN contact_messages.package_name IS 'اسم الباقة المرتبطة';
COMMENT ON COLUMN contact_messages.admin_user_id IS 'معرف المدير الذي رد على الرسالة';
COMMENT ON COLUMN contact_messages.admin_reply IS 'رد المدير على الرسالة';
COMMENT ON COLUMN contact_messages.admin_reply_date IS 'تاريخ رد المدير';
COMMENT ON COLUMN contact_messages.created_at IS 'تاريخ إنشاء الرسالة';
COMMENT ON COLUMN contact_messages.updated_at IS 'تاريخ آخر تحديث';

-- 4. إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_contact_messages_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. إنشاء trigger لتحديث updated_at
DROP TRIGGER IF EXISTS trigger_update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER trigger_update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_contact_messages_updated_at();

-- 6. إدراج بيانات تجريبية (اختياري)
INSERT INTO contact_messages (name, email, phone, subject, message, type, status) VALUES
('أحمد محمد', 'ahmed@example.com', '+966501234567', 'استفسار عن رحلة باريس', 'أرغب في معرفة تفاصيل رحلة باريس الرومانسية', 'inquiry', 'unread'),
('فاطمة علي', 'fatima@example.com', '+966502345678', 'شكوى في الخدمة', 'واجهت مشكلة في حجز الفندق', 'complaint', 'unread'),
('محمد السعد', 'mohammed@example.com', '+966503456789', 'اقتراح تحسين', 'أقترح إضافة المزيد من الوجهات الآسيوية', 'suggestion', 'read'),
('نورا أحمد', 'nora@example.com', '+966504567890', 'حجز رحلة تايلاند', 'أريد حجز رحلة تايلاند لشخصين', 'booking', 'unread')
ON CONFLICT DO NOTHING;

-- 7. التحقق من البيانات المدخلة
SELECT 
    id,
    name,
    email,
    subject,
    type,
    status,
    created_at
FROM contact_messages 
ORDER BY created_at DESC;

-- 8. إحصائيات سريعة
SELECT 
    status,
    COUNT(*) as count
FROM contact_messages 
GROUP BY status;

SELECT 
    type,
    COUNT(*) as count
FROM contact_messages 
GROUP BY type;
