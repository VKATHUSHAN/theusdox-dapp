# TheUSDOX Website Deployment Guide

## 🚀 Deploy to theusdox.com

### Option 1: Vercel (Recommended)

1. **Push to GitHub:**
   ```bash
   cd website
   git init
   git add .
   git commit -m "Initial commit: TheUSDOX website"
   git branch -M main
   git remote add origin https://github.com/yourusername/theusdox-website.git
   git push -u origin main
   ```

2. **Deploy with Vercel:**
   - Go to https://vercel.com
   - Connect your GitHub account
   - Import your repository
   - Set build settings:
     - Build Command: `npm run build`
     - Output Directory: `.next`
     - Root Directory: `website`

3. **Add Custom Domain:**
   - In Vercel project settings → Domains
   - Add: `theusdox.com`
   - Configure DNS records as shown

### Option 2: Netlify

1. **Build for production:**
   ```bash
   npm run build
   npm run export
   ```

2. **Deploy:**
   - Go to https://netlify.com
   - Drag & drop the `out` folder
   - Add custom domain: `theusdox.com`

### Option 3: Traditional Hosting

1. **Build static files:**
   ```bash
   npm run build
   npm run export
   ```

2. **Upload to web server:**
   - Upload contents of `out` folder to your web root
   - Configure domain DNS to point to your server

## 📋 DNS Configuration

For `theusdox.com`, add these DNS records:

```
Type: A
Name: @
Value: [Your hosting IP]

Type: CNAME
Name: www
Value: theusdox.com
```

## 🔒 SSL Certificate

Most hosting providers offer free SSL certificates. Enable HTTPS for:
- Security
- Better SEO rankings
- Trust indicators for users

## 🎯 Performance Optimizations

- ✅ Images optimized via CDN
- ✅ Code splitting enabled
- ✅ Static generation for fast loading
- ✅ Responsive design for all devices

## 📊 Analytics & Monitoring

Consider adding:
- Google Analytics
- Performance monitoring
- Error tracking (Sentry)
- SEO monitoring

Your website is ready to go live! 🚀