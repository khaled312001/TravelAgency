@echo off
echo 🚀 Travel Agency - Server Upload Script
echo ======================================
echo.

echo 📋 Instructions:
echo 1. Make sure you have generated static files (run deploy.bat first)
echo 2. Upload all files from .output\public\ to your public_html directory
echo 3. Make sure .htaccess is in the root of public_html
echo.

echo 📁 Files to upload:
echo - All files from .output\public\ directory
echo - .htaccess file (for Apache configuration)
echo.

echo 🔧 Server commands to run after upload:
echo find public_html -type f -exec chmod 644 {} \;
echo find public_html -type d -exec chmod 755 {} \;
echo.

echo 📊 Generated files summary:
if exist ".output\public\index.html" (
    echo ✅ index.html - Main page
) else (
    echo ❌ index.html - Missing!
)

if exist ".output\public\_nuxt" (
    echo ✅ _nuxt directory - JavaScript and CSS assets
) else (
    echo ❌ _nuxt directory - Missing!
)

if exist ".htaccess" (
    echo ✅ .htaccess - Apache configuration
) else (
    echo ❌ .htaccess - Missing!
)

echo.
echo 🌐 After upload, your site should be accessible at:
echo https://worldtripagency.com
echo.

pause
