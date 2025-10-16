# 🔑 إعداد Service Role Key

## المشكلة الحالية:
النظام يعمل ولكن تحتاج إلى Service Role Key لتمكين API من العمل بشكل كامل.

## الحل:

### الخطوة 1: احصل على Service Role Key
1. اذهب إلى: `https://supabase.com/dashboard/project/ueofktshvaqtxjsxvisv/settings/api`
2. انسخ المفتاح المسمى **"service_role"**

### الخطوة 2: أنشئ ملف .env
أنشئ ملف `.env` في مجلد المشروع وأضف:

```env
# Supabase Configuration
NUXT_PUBLIC_SUPABASE_URL=https://ueofktshvaqtxjsxvisv.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE

# JWT Secret for Admin Authentication
JWT_SECRET=your-super-secret-jwt-key-for-admin-authentication-2024

# Environment
NODE_ENV=development
```

### الخطوة 3: استبدل YOUR_SERVICE_ROLE_KEY_HERE
استبدل `YOUR_SERVICE_ROLE_KEY_HERE` بالمفتاح الذي نسخته من Supabase.

### الخطوة 4: أعد تشغيل الخادم
```bash
npm run dev
```

## بعد الإعداد:
- اذهب إلى: `http://localhost:3000/admin/login`
- استخدم: `info@worldtripagency.com` / `admin123`

## ملاحظة:
Service Role Key يبدأ عادة بـ `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` ويحتوي على `"role":"service_role"`
