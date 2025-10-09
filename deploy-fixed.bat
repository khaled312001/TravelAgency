@echo off
echo ========================================
echo Travel Agency - Fixed Deployment Script
echo ========================================
echo.

echo [1/4] Cleaning previous builds...
if exist ".output" rmdir /s /q ".output"
if exist "dist" rmdir /s /q "dist"
if exist ".nuxt" rmdir /s /q ".nuxt"

echo [2/4] Installing dependencies...
call npm install

echo [3/4] Building for production...
call npm run build

echo [4/4] Deployment options:
echo.
echo Choose your deployment platform:
echo 1. Vercel (Recommended)
echo 2. Netlify
echo 3. GoDaddy/Shared Hosting
echo.

set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo Deploying to Vercel...
    call npx vercel --prod
) else if "%choice%"=="2" (
    echo Deploying to Netlify...
    call npx netlify deploy --prod
) else if "%choice%"=="3" (
    echo Preparing for GoDaddy/Shared Hosting...
    echo.
    echo Instructions:
    echo 1. Upload the entire .output/public folder to your hosting
    echo 2. Make sure .htaccess is in the root directory
    echo 3. Ensure all files are uploaded correctly
    echo.
    echo Files ready in .output/public/
    pause
) else (
    echo Invalid choice. Please run the script again.
    pause
)

echo.
echo Deployment completed!
echo.
echo Test your site at:
echo - https://worldtripagency.com/
echo - https://www.worldtripagency.com/ (should redirect)
echo.
pause
