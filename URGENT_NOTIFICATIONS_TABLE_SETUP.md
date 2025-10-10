# 🚨 عاجل: إنشاء جدول الإشعارات!

## ❌ المشكلة:
```
GET /api/admin/notifications 500 (Internal Server Error)
Error: relation "notifications" does not exist
```

## ✅ الحل السريع:

### 1. **اذهب إلى Supabase Dashboard**:
- اذهب إلى: https://supabase.com/dashboard/project/ueofktshvaqtxjsxvisv
- سجل الدخول بحسابك

### 2. **افتح SQL Editor**:
- اضغط على "SQL Editor" في القائمة الجانبية
- اضغط "New query"

### 3. **انسخ والصق هذا الكود**:
```sql
-- Create notifications table for admin notifications
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_en VARCHAR(255),
  message TEXT NOT NULL,
  message_en TEXT,
  type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error', 'booking', 'message', 'system', 'alert')),
  is_read BOOLEAN DEFAULT false,
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_admin_user_id ON notifications(admin_user_id);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Allow public access to notifications (for admin notifications)
CREATE POLICY "Allow public access to notifications" ON notifications
  FOR ALL USING (true);

-- Insert some sample notifications for testing
INSERT INTO notifications (title, message, type, is_read) VALUES
('حجز جديد', 'تم إنشاء حجز جديد لرحلة إلى دبي', 'booking', false),
('رسالة جديدة', 'لديك رسالة جديدة من العميل أحمد محمد', 'message', true),
('تحديث النظام', 'تم تحديث النظام بنجاح', 'system', false),
('تنبيه مهم', 'يرجى مراجعة الحجوزات المعلقة', 'alert', true)
ON CONFLICT DO NOTHING;
```

### 4. **اضغط "Run"**

### 5. **جرب صفحة الإشعارات**:
- اذهب إلى: `https://www.worldtripagency.com/admin/notifications`
- ستظهر الإشعارات التجريبية

## 🎯 النتيجة:
بعد إنشاء الجدول، ستعمل صفحة الإشعارات بشكل مثالي مع:
- ✅ عرض الإشعارات من قاعدة البيانات
- ✅ فلاتر البحث والتصفية
- ✅ تعيين الإشعارات كمقروءة
- ✅ حذف الإشعارات
- ✅ إحصائيات شاملة

**🚨 هذا هو السبب الوحيد لعدم عمل صفحة الإشعارات!**
