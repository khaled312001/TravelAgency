@echo off
echo Deploying logo upload fixes...

echo Building project...
call npm run build

echo Deploying to Vercel...
call vercel --prod

echo Deployment complete!
pause
