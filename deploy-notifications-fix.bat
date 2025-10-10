@echo off
echo Deploying notifications fix...

echo Building project...
npm run build

echo Deploying to production...
npm run deploy

echo Notifications fix deployed successfully!
pause
