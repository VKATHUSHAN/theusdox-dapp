#!/bin/bash

# TheUSDOX Vercel Deployment Test Script
# Run this script to test your deployment setup

echo "🚀 TheUSDOX Vercel Deployment Test"
echo "=================================="

# Check if we're in the website directory
if [ ! -f "package.json" ]; then
    echo "📁 Navigating to website directory..."
    cd website
fi

# Check if Node.js and npm are installed
echo "🔧 Checking dependencies..."
node --version
npm --version

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🏗️ Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful! Ready for deployment."
    echo ""
    echo "📋 Next steps:"
    echo "1. Add GitHub secrets (VERCEL_TOKEN, VERCEL_ORG_ID, VERCEL_PROJECT_ID)"
    echo "2. Push to main branch to trigger automatic deployment"
    echo "3. Visit your Vercel dashboard to see deployment status"
    echo ""
    echo "🌐 Expected URLs:"
    echo "- Production: https://theusdox-dapp.vercel.app"
    echo "- Custom: https://theusdox.com (after domain setup)"
else
    echo "❌ Build failed! Check the errors above."
    exit 1
fi