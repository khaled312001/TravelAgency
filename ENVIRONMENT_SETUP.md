# إعداد متغيرات البيئة

## الملفات المطلوبة

أنشئ ملف `.env` في المجلد الجذر للمشروع مع المتغيرات التالية:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Secret for Admin Authentication
JWT_SECRET=your_jwt_secret_key_here

# Twilio Configuration (for WhatsApp notifications)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number
SALES_MANAGER_PHONE=your_sales_manager_phone

# Site URLs
PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Admin Default Credentials (for development only)
ADMIN_EMAIL=admin@wonderland.com
ADMIN_PASSWORD=admin123
```

## كيفية الحصول على قيم Supabase

1. اذهب إلى [Supabase Dashboard](https://supabase.com/dashboard)
2. اختر مشروعك أو أنشئ مشروع جديد
3. اذهب إلى Settings > API
4. انسخ القيم التالية:
   - `Project URL` → `SUPABASE_URL`
   - `anon public` → `SUPABASE_ANON_KEY`
   - `service_role secret` → `SUPABASE_SERVICE_ROLE_KEY`

## JWT Secret

أنشئ مفتاح JWT قوي:
```bash
# يمكنك استخدام هذا الأمر لإنشاء مفتاح عشوائي
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Twilio (اختياري)

إذا كنت تريد تفعيل إشعارات WhatsApp:
1. أنشئ حساب في [Twilio](https://www.twilio.com/)
2. احصل على Account SID و Auth Token
3. اشتر رقم هاتف Twilio
4. أضف هذه القيم في ملف `.env`

## ملاحظات الأمان

⚠️ **مهم:**
- لا تشارك ملف `.env` مع أي شخص
- أضف `.env` إلى `.gitignore`
- استخدم قيم مختلفة للإنتاج
- استخدم مفاتيح JWT قوية ومعقدة

## التحقق من الإعداد

بعد إعداد ملف `.env`، تأكد من:
1. تشغيل الخادم: `npm run dev`
2. عدم وجود أخطاء في وحدة التحكم
3. القدرة على الوصول لصفحة تسجيل الدخول
4. تسجيل الدخول باستخدام بيانات الإدارة
