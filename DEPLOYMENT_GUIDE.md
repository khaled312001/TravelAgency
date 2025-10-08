# Deployment Guide for Shared Hosting

## Problem Fixed
The 403 Forbidden error was caused by:
- Nuxt app configured for Vercel deployment instead of static hosting
- Missing proper Apache configuration
- No static file generation

## Solution Applied

### 1. Updated Nuxt Configuration
- Changed `nitro.preset` from `'vercel'` to `'static'`
- Added `ssr: false` for static generation
- Updated route rules for proper prerendering

### 2. Created Deployment Files
- `.htaccess` - Apache configuration for SPA routing and security
- `deploy.sh` - Linux/Mac deployment script
- `deploy.bat` - Windows deployment script

## Deployment Steps

### Option 1: Using Deployment Scripts

#### For Windows:
```bash
deploy.bat
```

#### For Linux/Mac:
```bash
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Manual Deployment

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Generate static files:**
   ```bash
   npm run generate
   ```

3. **Upload files:**
   - Upload all files from `.output/public/` to your `public_html` directory
   - Make sure `.htaccess` is in the root of `public_html`

4. **Set file permissions:**
   ```bash
   find .output/public -type f -exec chmod 644 {} \;
   find .output/public -type d -exec chmod 755 {} \;
   ```

## File Structure After Deployment

```
public_html/
├── .htaccess
├── index.html
├── _nuxt/
│   ├── css/
│   └── js/
├── images/
├── icons/
└── ... (other static assets)
```

## Important Notes

1. **Admin Panel**: The admin panel (`/admin/**`) is set to `ssr: false`, so it will work as a client-side application
2. **API Routes**: Server-side API routes won't work in static mode. Consider using external APIs or serverless functions
3. **Database**: Supabase will work as it's a client-side integration
4. **PWA**: Service worker and PWA features will work in static mode

## Troubleshooting

### If you still get 403 errors:
1. Check that `.htaccess` is uploaded and has correct permissions
2. Verify that `index.html` exists in the root directory
3. Check server error logs for specific issues

### If pages don't load:
1. Ensure all files from `.output/public/` are uploaded
2. Check browser console for JavaScript errors
3. Verify that the `_nuxt` directory contains the built assets

## Environment Variables

Make sure to set these in your hosting environment or build process:
- `NODE_ENV=production`
- `PUBLIC_SITE_URL=https://worldtripagency.com`

## Support

If you encounter issues:
1. Check the browser console for errors
2. Verify file permissions on the server
3. Check server error logs
4. Ensure all static files are properly uploaded
