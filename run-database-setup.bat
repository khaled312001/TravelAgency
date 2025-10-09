@echo off
echo ========================================
echo    إعداد قاعدة البيانات لفورم التواصل
echo ========================================
echo.

echo 1. تثبيت التبعيات...
npm install @supabase/supabase-js dotenv

echo.
echo 2. اختبار الاتصال بقاعدة البيانات...
node test-database-connection.js

echo.
echo 3. إعداد قاعدة البيانات...
node setup-contact-database.js

echo.
echo ========================================
echo    تم الانتهاء من الإعداد
echo ========================================
echo.
echo يمكنك الآن:
echo - اختبار فورم التواصل في الصفحة الرئيسية
echo - اختبار فورم البكجات
echo - مراجعة لوحة الإدارة في /admin/messages
echo.
pause
