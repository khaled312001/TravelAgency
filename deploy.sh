#!/bin/bash

echo "🚀 Starting deployment process..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate static files
echo "🔨 Generating static files..."
npm run generate

# Check if generation was successful
if [ -d ".output/public" ]; then
    echo "✅ Static files generated successfully!"
    echo "📁 Files are in .output/public directory"
    echo ""
    echo "📋 Next steps:"
    echo "1. Upload all files from .output/public/ to your public_html directory"
    echo "2. Make sure .htaccess is in the root of public_html"
    echo "3. Set proper file permissions (644 for files, 755 for directories)"
    echo ""
    echo "🔧 File permissions commands:"
    echo "find .output/public -type f -exec chmod 644 {} \;"
    echo "find .output/public -type d -exec chmod 755 {} \;"
    echo ""
    echo "📊 Generated files:"
    ls -la .output/public/
else
    echo "❌ Static generation failed!"
    exit 1
fi
