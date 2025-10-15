Write-Host "Deploying logo upload fixes..." -ForegroundColor Green

Write-Host "Building project..." -ForegroundColor Yellow
npm run build

Write-Host "Deploying to Vercel..." -ForegroundColor Yellow
vercel --prod

Write-Host "Deployment complete!" -ForegroundColor Green
Read-Host "Press Enter to continue"
