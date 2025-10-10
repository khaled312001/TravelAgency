# 🚨 إصلاح سريع: إنشاء جداول قاعدة البيانات

## ❌ المشكلة:
```
POST /api/notifications/subscribe 500 (Internal Server Error)
POST /api/notifications/send 500 (Internal Server Error)
```

## ✅ الحل السريع:

### 1. **اذهب إلى Supabase**:
- https://supabase.com/dashboard/project/ueofktshvaqtxjsxvisv
- اضغط "SQL Editor"
- اضغط "New query"

### 2. **انسخ هذا الكود**:
```sql
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id SERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  keys JSONB NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notifications (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'message',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public access to push_subscriptions" ON push_subscriptions
  FOR ALL USING (true);

CREATE POLICY "Allow public access to notifications" ON notifications
  FOR ALL USING (true);
```

### 3. **اضغط "Run"**

### 4. **جرب الإشعارات مرة أخرى**:
- https://www.worldtripagency.com/admin/notifications/setup
- اضغط "تفعيل الإشعارات"

## 🎯 النتيجة:
بعد إنشاء الجداول، ستعمل الإشعارات بشكل مثالي!

**🚨 هذا هو السبب الوحيد لعدم عمل الإشعارات!**
