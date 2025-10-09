# إصلاح مشكلة إعادة توجيه الدومين

## المشكلة
- الدومين `https://www.worldtripagency.com/` يعمل بشكل صحيح والصور تظهر
- الدومين `https://worldtripagency.com/` (بدون www) لا يعمل والصور لا تظهر

## الحل المطبق

### 1. تحديث nuxt.config.ts
- تغيير `productionURL` من `https://worldtripagency.com` إلى `https://www.worldtripagency.com`
- تحديث `publicSiteUrl` و `baseUrl` في i18n لاستخدام الدومين مع www
- إضافة الدومينين في `image.domains` لضمان عمل الصور
- إضافة CORS headers للصور في `/_ipx/**`

### 2. تحديث netlify.toml
- تغيير إعادة التوجيه من `www` إلى بدون `www` إلى العكس
- إضافة CORS headers للصور

### 3. تحديث vercel.json
- إضافة إعادة توجيه من الدومين بدون www إلى الدومين مع www
- إضافة CORS headers للصور

### 4. تحديث .htaccess
- تغيير إعادة التوجيه من `www` إلى بدون `www` إلى العكس
- إضافة CORS headers للصور

## النتيجة المتوقعة
- جميع الزوار سيتم إعادة توجيههم تلقائياً إلى `https://www.worldtripagency.com/`
- الصور ستظهر بشكل صحيح على كلا الدومينين
- تحسين SEO من خلال توحيد الدومين

## الملفات المحدثة
- `nuxt.config.ts`
- `netlify.toml`
- `vercel.json`
- `.htaccess`

## ملاحظات
- تم إصلاح جميع أخطاء TypeScript
- تم إضافة CORS headers لضمان عمل الصور
- تم توحيد إعدادات الدومين في جميع ملفات الكونفج
