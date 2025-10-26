# Vercel Auto-Deployment Setup Guide 🚀

## ✅ **Vercel Integration Configured!**

Your project is now set up for automatic deployment to Vercel with the provided API key.

## 📋 **What's Been Set Up**

### 1. **Configuration Files Created**
- ✅ `vercel.json` (root directory) - Main project configuration
- ✅ `website/vercel.json` - Website-specific configuration  
- ✅ `.github/workflows/vercel-deploy.yml` - GitHub Actions workflow
- ✅ Environment variables added to `.env`

### 2. **Deployment Workflow**
- **🔄 Automatic deployments** on every push to `main` branch
- **📱 Preview deployments** for pull requests
- **🔒 Secure environment variable handling**
- **💬 Automatic deployment status comments** on PRs

## 🔑 **Next Steps: GitHub Secrets Setup**

You need to add these secrets to your GitHub repository:

### **Required GitHub Secrets:**
1. Go to **GitHub.com** → **Your Repository** → **Settings** → **Secrets and Variables** → **Actions**
2. Click **"New repository secret"** and add each of these:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `VERCEL_TOKEN` | `prj_WI7CYvAFurHtu0FFOHP3qadGjADF` | Your Vercel API token |
| `VERCEL_ORG_ID` | `your_vercel_org_id` | Your Vercel organization ID |
| `VERCEL_PROJECT_ID` | `your_vercel_project_id` | Your Vercel project ID |

### **Optional API Keys (for full functionality):**
| Secret Name | Example Value | Description |
|-------------|---------------|-------------|
| `VITE_BSC_RPC` | `https://bsc-dataseed1.binance.org/` | BSC RPC endpoint |
| `VITE_ALCHEMY_KEY` | `your_alchemy_key` | Alchemy API key |
| `VITE_INFURA_API_KEY` | `your_infura_key` | Infura API key |
| `VITE_WALLETCONNECT_PROJECT_ID` | `your_wc_project_id` | WalletConnect project ID |
| `VITE_0X_API_KEY` | `your_0x_key` | 0x Protocol API key |

## 🚀 **Getting Vercel IDs**

### Method 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel (follow prompts)
vercel login

# Link your project
cd website
vercel link

# Get project and org IDs
vercel env ls
```

### Method 2: Manual Setup
1. Go to **[Vercel Dashboard](https://vercel.com/dashboard)**
2. Create a new project or find existing one
3. **Project Settings** → **General** → Copy Project ID
4. **Account Settings** → Copy Organization ID

## 🔧 **Manual Deployment Commands**

```bash
# Navigate to website directory
cd website

# Install Vercel CLI (if not installed)
npm install -g vercel

# Deploy to preview
vercel

# Deploy to production  
vercel --prod

# Deploy with custom domain
vercel --prod --alias theusdox.com
```

## 🌐 **Expected Deployment URLs**

- **Production**: `https://theusdox-dapp.vercel.app`
- **Custom Domain**: `https://theusdox.com` (after domain configuration)
- **Preview**: `https://theusdox-dapp-git-[branch-name]-[username].vercel.app`

## 🎯 **Automatic Deployment Triggers**

### **Production Deployments** (when you push to `main`):
- ✅ Builds the website
- ✅ Deploys to production URL
- ✅ Updates theusdox.com (if domain configured)

### **Preview Deployments** (when you create a PR):
- ✅ Builds the website
- ✅ Creates preview URL
- ✅ Comments the preview URL on the PR

## 📁 **Configuration Files Explained**

### **Root `vercel.json`**
- Handles monorepo structure
- Routes requests to website directory
- Sets up environment variables

### **Website `vercel.json`**
- Next.js specific configuration
- Security headers
- API function settings
- Redirect rules

### **GitHub Actions Workflow**
- Runs on push/PR to main
- Builds and deploys automatically
- Manages environment variables
- Posts deployment status

## ⚠️ **Important Security Notes**

1. **🔒 Never commit API keys** to the repository
2. **✅ Use GitHub Secrets** for sensitive data
3. **🔄 Rotate keys periodically** for security
4. **📋 Environment variables** are automatically encrypted

## 🆘 **Troubleshooting**

### **Deployment Fails:**
1. Check GitHub Actions logs
2. Verify all required secrets are set
3. Ensure build passes locally: `npm run build`

### **Environment Variables Missing:**
1. Add missing secrets to GitHub repository
2. Check variable names match exactly
3. Redeploy after adding secrets

### **Domain Issues:**
1. Configure domain in Vercel dashboard
2. Update DNS settings
3. Wait for propagation (up to 24 hours)

## 🎉 **Success Indicators**

✅ **GitHub Actions workflow runs successfully**
✅ **Deployment URLs are accessible**  
✅ **Website loads without errors**
✅ **Environment variables work correctly**

---

## 📞 **Need Help?**

- **Vercel Docs**: https://vercel.com/docs
- **GitHub Actions**: https://docs.github.com/actions
- **Next.js Deployment**: https://nextjs.org/docs/deployment

**Your website will be automatically deployed on every commit! 🚀**