# 🔑 الحصول على Service Role Key الصحيح

## ⚠️ المشكلة الحالية:
خطأ 500 عند الحفظ - Service Role Key غير صحيح

## 🔧 الحل:

### 1. اذهب إلى Supabase Dashboard
https://supabase.com/dashboard

### 2. اختر مشروعك
`ueofktshvaqtxjsxvisv`

### 3. اذهب إلى Settings > API
- اضغط على "Settings" في القائمة الجانبية
- اضغط على "API"

### 4. انسخ Service Role Key
- ابحث عن "service_role" key
- انسخ المفتاح الكامل
- **مهم**: لا تنسخ "anon" key، يجب أن يكون "service_role" key

### 5. أرسل لي المفتاح
- أرسل لي المفتاح الصحيح
- سأضعه في الكود

## 📋 مثال على المفتاح:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.XXXXXXXXXXXX
```

## 🎯 بعد الحصول على المفتاح:
- سأضعه في API endpoints
- ستعمل وظيفة الحفظ
- سيتم حفظ التغييرات في قاعدة البيانات

## 📞 ملاحظة:
Service Role Key يبدأ بـ `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9` ويحتوي على `"role":"service_role"` في الوسط.
