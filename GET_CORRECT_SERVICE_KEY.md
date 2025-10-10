# 🔑 الحصول على Service Role Key الصحيح

## ⚠️ المشكلة الحالية:
النصوص لا تتعدل عند الحفظ - Service Role Key غير صحيح

## 🔧 الحل:

### 1. اذهب إلى Supabase Dashboard
https://supabase.com/dashboard

### 2. اختر مشروعك
`ueofktshvaqtxjsxvisv`

### 3. اذهب إلى Settings > API
- اضغط على "Settings" في القائمة الجانبية
- اضغط على "API"

### 4. انسخ Service Role Key الصحيح
- ابحث عن "service_role" key (ليس "anon" key)
- انسخ المفتاح الكامل
- المفتاح يجب أن يحتوي على `"role":"service_role"`

### 5. أرسل لي المفتاح
- أرسل لي المفتاح الصحيح
- سأضعه في الكود

## 📋 مثال على المفتاح الصحيح:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.XXXXXXXXXXXX
```

## 🔍 كيفية التمييز:
- **Service Role Key**: يحتوي على `"role":"service_role"`
- **Anon Key**: يحتوي على `"role":"anon"`

## 🎯 بعد الحصول على المفتاح:
- سأضعه في API endpoints
- ستعمل وظيفة الحفظ
- سيتم حفظ التغييرات في قاعدة البيانات
- ستظهر التغييرات في الموقع

## 📞 ملاحظة:
Service Role Key يبدأ بـ `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` ويحتوي على `"role":"service_role"` في الوسط.

**🚨 أرسل لي Service Role Key الصحيح لأصلح مشكلة الحفظ!**
