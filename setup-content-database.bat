@echo off
echo ========================================
echo    إعداد قاعدة بيانات إدارة المحتوى
echo ========================================
echo.

echo جاري إنشاء جدول site_content...
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo خطأ: Supabase CLI غير مثبت
    echo يرجى تثبيت Supabase CLI أولاً
    echo https://supabase.com/docs/guides/cli
    pause
    exit /b 1
)

REM Run the SQL file
echo تشغيل ملف SQL...
supabase db reset --db-url "postgresql://postgres:[YOUR_PASSWORD]@[YOUR_HOST]:5432/postgres" < create-site-content-table.sql

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✅ تم إنشاء جدول site_content بنجاح!
    echo.
    echo يمكنك الآن:
    echo 1. تشغيل المشروع: npm run dev
    echo 2. الذهاب إلى: http://localhost:3000/admin/login
    echo 3. تسجيل الدخول والذهاب إلى "إدارة المحتوى"
    echo.
) else (
    echo.
    echo ❌ حدث خطأ أثناء إنشاء الجدول
    echo يرجى التحقق من اتصال قاعدة البيانات
    echo.
)

pause
