# 🎉 إعداد قاعدة البيانات الجديدة - دليل شامل

## ✅ تم تحديث المشروع بنجاح!

### 🔧 التحديثات المنجزة:
- ✅ تم تحديث `nuxt.config.ts` مع المشروع الجديد
- ✅ تم إنشاء ملف SQL شامل لجميع الجداول
- ✅ تم إنشاء صفحة إعداد تفاعلية
- ✅ تم تحديث ملفات API

## 🚀 خطوات الإعداد:

### **الخطوة 1: افتح صفحة الإعداد**
اذهب إلى: `http://localhost:3000/setup-new-database.html`

### **الخطوة 2: اتبع التعليمات في الصفحة**
1. انقر على "فتح Supabase SQL Editor"
2. انسخ الكود SQL
3. الصقه في Supabase SQL Editor
4. انقر على "Run"

### **الخطوة 3: احصل على Service Role Key**
بعد إنشاء الجداول، ستحتاج إلى Service Role Key:

1. اذهب إلى: `https://supabase.com/dashboard/project/ueofktshvaqtxjsxvisv/settings/api`
2. انسخ "service_role" key
3. أضفه إلى ملف `.env`:

```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

### **الخطوة 4: تسجيل الدخول**
اذهب إلى: `http://localhost:3000/admin/login`

**بيانات الدخول:**
- **البريد:** `info@worldtripagency.com`
- **كلمة المرور:** `admin123`

## 📊 ما سيتم إنشاؤه:

### **الجداول الأساسية:**
- ✅ `packages` - الباقات السياحية
- ✅ `package_options` - خيارات الباقات
- ✅ `destinations` - الوجهات السياحية
- ✅ `bookings` - الحجوزات
- ✅ `contact_messages` - رسائل الاتصال

### **جداول الإدارة:**
- ✅ `admin_users` - مستخدمي الإدارة
- ✅ `admin_sessions` - جلسات الإدارة
- ✅ `admin_activity_logs` - سجل الأنشطة

### **جداول إضافية:**
- ✅ `seo_settings` - إعدادات SEO
- ✅ `notifications` - الإشعارات

### **البيانات الأساسية:**
- ✅ 2 حساب إدارة (admin, manager)
- ✅ 5 وجهات سياحية
- ✅ 5 باقات سياحية
- ✅ إعدادات SEO
- ✅ إشعارات أساسية

## 🔑 معلومات المشروع الجديد:

**Project URL:** `https://ueofktshvaqtxjsxvisv.supabase.co`
**Project ID:** `ueofktshvaqtxjsxvisv`

## 🌐 الروابط المهمة:

- **صفحة الإعداد:** `http://localhost:3000/setup-new-database.html`
- **Supabase Dashboard:** `https://supabase.com/dashboard/project/ueofktshvaqtxjsxvisv`
- **SQL Editor:** `https://supabase.com/dashboard/project/ueofktshvaqtxjsxvisv/sql`
- **API Settings:** `https://supabase.com/dashboard/project/ueofktshvaqtxjsxvisv/settings/api`
- **لوحة التحكم:** `http://localhost:3000/admin/login`

## 🎯 الميزات المتاحة:

### **للمستخدمين:**
- تصفح الباقات السياحية
- عرض الوجهات
- إرسال رسائل الاتصال
- طلب حجوزات

### **للإدارة:**
- إدارة الباقات والوجهات
- إدارة الحجوزات
- إدارة الرسائل
- إحصائيات مفصلة
- إعدادات SEO
- إدارة الإشعارات

## 🔧 استكشاف الأخطاء:

### **إذا واجهت مشاكل:**
1. تأكد من تشغيل الخادم: `npm run dev`
2. تأكد من إضافة Service Role Key في `.env`
3. تأكد من تشغيل الكود SQL بنجاح
4. تحقق من اتصال الإنترنت

### **للحصول على Service Role Key:**
1. اذهب إلى: `https://supabase.com/dashboard/project/ueofktshvaqtxjsxvisv/settings/api`
2. انسخ "service_role" key
3. أضفه إلى ملف `.env`

## 🎉 النتيجة النهائية:

**لديك الآن نظام إدارة كامل ومتطور لوكالة السفر مع قاعدة بيانات جديدة!**

### **الخطوات النهائية:**
1. ✅ افتح `http://localhost:3000/setup-new-database.html`
2. ✅ اتبع التعليمات لإنشاء الجداول
3. ✅ احصل على Service Role Key
4. ✅ أضفه إلى ملف `.env`
5. ✅ اذهب إلى `http://localhost:3000/admin/login`
6. ✅ سجل دخول باستخدام `info@worldtripagency.com` / `admin123`
7. ✅ استمتع بالنظام الكامل!

---

**النظام جاهز للاستخدام! 🚀**
