# 🔔 إعداد Push Notifications

## ✅ تم إضافة نظام الإشعارات!

### 🎯 الميزات الجديدة:
- ✅ **Push Notifications**: إشعارات حتى لو كان المتصفح مغلق
- ✅ **Service Worker**: يعمل في الخلفية
- ✅ **إدارة الإشعارات**: صفحة مخصصة في لوحة التحكم
- ✅ **اشتراك تلقائي**: للمستخدمين الجدد

## 🚀 كيفية الإعداد:

### 1. إنشاء جدول قاعدة البيانات

1. **اذهب إلى Supabase Dashboard**: https://supabase.com/dashboard
2. **اختر مشروعك**: `ueofktshvaqtxjsxvisv`
3. **اضغط على "SQL Editor"**
4. **انسخ والصق هذا الكود**:

```sql
-- إنشاء جدول push_subscriptions لتخزين اشتراكات الإشعارات
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id SERIAL PRIMARY KEY,
  endpoint TEXT NOT NULL UNIQUE,
  keys JSONB NOT NULL,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- إنشاء فهرس للبحث السريع
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_endpoint ON push_subscriptions(endpoint);

-- إنشاء دالة لتحديث updated_at تلقائياً
CREATE OR REPLACE FUNCTION update_push_subscriptions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- إنشاء trigger لتحديث updated_at تلقائياً
DROP TRIGGER IF EXISTS update_push_subscriptions_updated_at ON push_subscriptions;
CREATE TRIGGER update_push_subscriptions_updated_at
    BEFORE UPDATE ON push_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_push_subscriptions_updated_at();
```

5. **اضغط على "Run"**

### 2. تثبيت web-push package

```bash
npm install web-push
```

### 3. إنشاء VAPID Keys

```bash
npx web-push generate-vapid-keys
```

## 🧪 كيفية الاستخدام:

### 1. صفحة إدارة الإشعارات
```
https://www.worldtripagency.com/admin/notifications
```

### 2. إرسال إشعار
- اكتب عنوان الإشعار
- اكتب رسالة الإشعار
- اختر رابط (اختياري)
- اضغط "إرسال الإشعار"

### 3. تفعيل الإشعارات للمستخدمين
- المستخدمون سيتلقون طلب إذن تلقائياً
- يمكنهم الموافقة أو الرفض
- الإشعارات ستصل حتى لو كان المتصفح مغلق

## 🎯 الميزات المتاحة:

### للمستخدمين:
- ✅ **إشعارات فورية**: تصل فوراً
- ✅ **إشعارات في الخلفية**: حتى لو كان المتصفح مغلق
- ✅ **إشعارات تفاعلية**: أزرار فتح وإغلاق
- ✅ **إشعارات مخصصة**: عنوان ورسالة مخصصة

### للإدارة:
- ✅ **إرسال إشعارات**: لجميع المشتركين
- ✅ **إحصائيات**: عدد المشتركين
- ✅ **حالة النظام**: حالة Service Worker و Push API
- ✅ **إدارة سهلة**: واجهة بسيطة

## 🔧 الملفات المُنشأة:

### API Endpoints:
- `server/api/notifications/vapid-public-key.get.ts`
- `server/api/notifications/subscribe.post.ts`
- `server/api/notifications/send.post.ts`
- `server/api/notifications/subscriptions-count.get.ts`

### المكونات:
- `components/NotificationManager.vue`
- `pages/admin/notifications/index.vue`

### Service Worker:
- `public/sw-notifications.js`

### قاعدة البيانات:
- `create-push-subscriptions-table.sql`

## 🎉 النتيجة النهائية:

النظام الآن يدعم:
- ✅ **إشعارات فورية** للمستخدمين
- ✅ **إشعارات في الخلفية** حتى لو كان المتصفح مغلق
- ✅ **إدارة سهلة** للإشعارات
- ✅ **اشتراك تلقائي** للمستخدمين الجدد
- ✅ **إحصائيات** عدد المشتركين

## 📞 الدعم:

إذا واجهت أي مشاكل:
1. تأكد من إنشاء جدول قاعدة البيانات
2. تأكد من تثبيت web-push package
3. تحقق من console للأخطاء

**🎊 نظام الإشعارات جاهز للاستخدام!**
