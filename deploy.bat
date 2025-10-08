@echo off
echo 🚀 Starting deployment process...

echo 📦 Installing dependencies...
call npm install

echo 🔨 Generating static files...
call npm run generate

if exist ".output\public" (
    echo ✅ Static files generated successfully!
    echo 📁 Files are in .output\public directory
    echo.
    echo 📋 Next steps:
    echo 1. Upload all files from .output\public\ to your public_html directory
    echo 2. Make sure .htaccess is in the root of public_html
    echo 3. Set proper file permissions (644 for files, 755 for directories)
    echo.
    echo 📊 Generated files:
    dir .output\public
) else (
    echo ❌ Static generation failed!
    exit /b 1
)

pause
