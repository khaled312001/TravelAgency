# Deployment Fix for 403 Forbidden Error

## Issues Fixed

1. **Domain Configuration**: Updated all URLs from `wonderland1.com` to `worldtripagency.com`
2. **Vercel Configuration**: Fixed output directory and added proper serverless function configuration
3. **Nuxt Configuration**: Changed from static preset to Vercel preset for proper serverless deployment
4. **Build Script**: Updated to use `nuxt build` instead of `nuxt generate` for serverless deployment
5. **Middleware**: Fixed locale middleware to use proper Nuxt route middleware syntax

## Changes Made

### nuxt.config.ts
- Updated `productionURL` to `https://worldtripagency.com`
- Updated i18n `baseUrl` to use the correct domain
- Updated `publicSiteUrl` to use the correct domain
- Changed Nitro preset from `static` to `vercel`

### vercel.json
- Added proper serverless function configuration
- Kept output directory as `.output` (correct for Vercel)
- Added runtime specification for API functions

### package.json
- Changed build command from `nuxt generate` to `nuxt build`

### middleware/locale.ts
- Fixed to use proper Nuxt route middleware syntax

## Deployment Steps

1. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "Fix deployment configuration for worldtripagency.com"
   git push
   ```

2. **Redeploy on Vercel**:
   - Go to your Vercel dashboard
   - Trigger a new deployment
   - Or if using automatic deployments, the push will trigger it

3. **Verify Environment Variables**:
   Make sure these are set in your Vercel project settings:
   ```
   NUXT_PUBLIC_SUPABASE_URL=https://ueofktshvaqtxjsxvisv.supabase.co
   NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MjMxNzYsImV4cCI6MjA3NTQ5OTE3Nn0.f61pBbPa0QvCKRY-bF-iaIkrMrZ08NUbyrHvdazsIYA
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlb2ZrdHNodmFxdHhqc3h2aXN2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTkyMzE3NiwiZXhwIjoyMDc1NDk5MTc2fQ.8x1bRWz6UgyRgkMQf5c32qABhgRNnY-p8Q2Sz9S-jn0
   JWT_SECRET=your-super-secret-jwt-key-for-admin-authentication-2024
   TWILIO_ACCOUNT_SID=ACdc6d0e7d9414a1b7b2ef42edf530df0c
   TWILIO_AUTH_TOKEN=2c9934b89762af46299d50d8d049ea99
   TWILIO_PHONE_NUMBER=+14155238886
   SALES_MANAGER_PHONE=+966500982394
   PUBLIC_SITE_URL=https://worldtripagency.com/
   NODE_ENV=production
   ADMIN_EMAIL=admin@wonderland.com
   ADMIN_PASSWORD=admin123
   ```

## Expected Result

After redeployment, your site should be accessible at `https://worldtripagency.com/` without the 403 Forbidden error.

## Troubleshooting

If you still get a 403 error:

1. Check Vercel deployment logs for any build errors
2. Verify that all environment variables are properly set
3. Ensure your domain is properly configured in Vercel
4. Check if there are any custom domain settings that need to be updated
