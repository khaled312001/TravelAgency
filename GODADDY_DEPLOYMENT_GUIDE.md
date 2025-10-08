# GoDaddy Deployment Guide for Travel Agency Website

## Overview
This guide will help you deploy your Nuxt.js travel agency website to GoDaddy hosting. Since GoDaddy uses traditional web hosting (not serverless), we've configured the site for static generation.

## Changes Made for GoDaddy Compatibility

### ✅ Configuration Updates
1. **Nitro Preset**: Changed from `vercel` to `static` for static site generation
2. **Build Script**: Updated to use `nuxt generate` for static file generation
3. **API Routes**: Removed server-side API routes (not supported on GoDaddy)
4. **Client-Side Supabase**: Updated composables to use direct Supabase client calls
5. **Domain Configuration**: Updated all URLs to use `worldtripagency.com`

### ✅ Files Modified
- `nuxt.config.ts` - Updated for static deployment
- `package.json` - Changed build command
- `composables/usePackages.ts` - Now uses client-side Supabase
- `composables/useWhatsApp.ts` - Updated for client-side storage
- Removed `vercel.json` (not needed for GoDaddy)
- Removed `server/` directory (serverless functions not supported)

## Deployment Steps

### 1. Build the Static Site
```bash
# Install dependencies
npm install

# Generate static files
npm run generate
```

This will create a `dist` folder with all static files.

### 2. Upload to GoDaddy

#### Option A: File Manager (Recommended)
1. Log into your GoDaddy account
2. Go to **My Products** → **Web Hosting** → **Manage**
3. Open **File Manager**
4. Navigate to `public_html` folder
5. **Delete all existing files** in `public_html`
6. Upload all contents from the `dist` folder to `public_html`

#### Option B: FTP Upload
1. Use an FTP client (FileZilla, WinSCP, etc.)
2. Connect to your GoDaddy hosting
3. Navigate to `public_html` folder
4. Upload all contents from the `dist` folder

### 3. Set Up Domain (if not already done)
1. In GoDaddy, go to **My Products** → **Domains**
2. Find `worldtripagency.com`
3. Click **Manage** → **DNS**
4. Point the domain to your hosting:
   - **A Record**: `@` → Your hosting IP
   - **CNAME**: `www` → `worldtripagency.com`

### 4. Configure Environment Variables
Since GoDaddy doesn't support server-side environment variables for static sites, the Supabase configuration is embedded in the build. The following are already configured in `nuxt.config.ts`:

```typescript
supabase: {
  url: 'https://ueofktshvaqtxjsxvisv.supabase.co',
  key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' // Your anon key
}
```

## Important Notes

### ⚠️ Limitations with Static Hosting
1. **No Server-Side API Routes**: All API calls now use client-side Supabase
2. **No Twilio WhatsApp Integration**: WhatsApp notifications are stored in database only
3. **Admin Panel**: May have limited functionality without server-side authentication

### ✅ What Still Works
1. **Static Pages**: All pages load correctly
2. **Supabase Integration**: Database operations work via client-side
3. **Contact Forms**: Store data in Supabase
4. **Package Display**: All packages load from database
5. **Multi-language Support**: i18n works correctly
6. **PWA Features**: Service worker and offline functionality

## File Structure After Build
```
dist/
├── index.html
├── 200.html
├── 404.html
├── _nuxt/          # JavaScript and CSS files
├── images/         # All images
├── icons/          # PWA icons
├── en-US/          # English pages
├── packages/       # Package pages
├── destinations/   # Destination pages
├── admin/          # Admin pages (client-side only)
└── ...other files
```

## Troubleshooting

### 403 Forbidden Error
If you still get a 403 error:
1. **Check File Permissions**: Ensure files in `public_html` have correct permissions (644 for files, 755 for folders)
2. **Check .htaccess**: Create a `.htaccess` file in `public_html` with:
   ```apache
   RewriteEngine On
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ /index.html [QSA,L]
   ```
3. **Clear Browser Cache**: Hard refresh (Ctrl+F5) or clear browser cache

### Pages Not Loading
1. **Check File Upload**: Ensure all files from `dist` folder are uploaded
2. **Check File Names**: Ensure no special characters in file names
3. **Check .htaccess**: Make sure rewrite rules are correct

### Database Connection Issues
1. **Check Supabase URL**: Verify the URL in `nuxt.config.ts` is correct
2. **Check API Key**: Ensure the anon key is correct
3. **Check RLS Policies**: Make sure Supabase Row Level Security allows public access

## Alternative Solutions

### If You Need Server-Side Features
Consider these hosting options that support serverless functions:
1. **Vercel** (recommended for Nuxt)
2. **Netlify**
3. **Railway**
4. **DigitalOcean App Platform**

### For WhatsApp Notifications
Since Twilio integration doesn't work with static hosting, you can:
1. **Use Supabase Edge Functions** (if available)
2. **Set up a separate server** for notifications
3. **Use a third-party service** like Zapier
4. **Manual monitoring** of the Supabase database

## Support
If you encounter issues:
1. Check the browser console for errors
2. Verify all files are uploaded correctly
3. Test the Supabase connection
4. Check GoDaddy hosting logs

## Next Steps
1. Build and upload the site
2. Test all functionality
3. Set up monitoring for contact forms
4. Consider upgrading to a hosting solution that supports serverless functions if needed
