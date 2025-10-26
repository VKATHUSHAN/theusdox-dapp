# Security Setup Guide 🔐

## 🚨 IMPORTANT: Keep Your Environment Secure

Your `.env` file contains sensitive API keys and configuration. **NEVER commit this file to version control!**

## ✅ Security Checklist

### 1. Environment File Protection
- ✅ `.env` file is created locally
- ✅ `.env` is listed in `.gitignore` 
- ✅ Only `.env.example` template is committed
- ⚠️ **Never share your actual API keys publicly**

### 2. API Key Security
Replace these placeholder values in your `.env` file:

```bash
# Get your API keys from these providers:
VITE_ALCHEMY_KEY=your_alchemy_api_key_here          # https://alchemy.com
VITE_INFURA_API_KEY=your_infura_project_id_here    # https://infura.io
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here  # https://walletconnect.com
VITE_0X_API_KEY=your_0x_api_key_here               # https://0x.org
```

### 3. Blockchain Explorer Keys
```bash
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key_here    # https://etherscan.io/apis
VITE_BSCSCAN_API_KEY=your_bscscan_api_key_here        # https://bscscan.com/apis
```

### 4. Contract Addresses
Update these after deploying your smart contracts:
```bash
VITE_USDOX_CONTRACT=0xYOUR_DEPLOYED_USDOX_CONTRACT_ADDRESS
VITE_VAULT_CONTRACT=0xYOUR_DEPLOYED_VAULT_CONTRACT_ADDRESS
VITE_ORACLE_CONTRACT=0xYOUR_DEPLOYED_ORACLE_CONTRACT_ADDRESS
```

## 🔒 Production Security

### For Production Deployment:
1. **Use Environment Variables**: Set sensitive values in your hosting platform (Vercel, Netlify, etc.)
2. **Rotate Keys Regularly**: Change API keys periodically
3. **Limit API Key Permissions**: Use read-only keys where possible
4. **Monitor Usage**: Keep track of API key usage and limits

### For Smart Contracts:
- ⚠️ **NEVER** put private keys in frontend code
- Use wallet connections (MetaMask, WalletConnect) for signing
- Deploy contracts from secure environments only

## 🚀 Quick Setup

1. Copy the environment template:
   ```bash
   cp .env.example .env
   ```

2. Fill in your actual API keys in `.env`

3. Verify the file is ignored:
   ```bash
   git status  # .env should not appear in untracked files
   ```

## 🆘 If You Accidentally Committed Secrets

1. **Immediately rotate all exposed API keys**
2. Remove the commit from history:
   ```bash
   git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch .env' --prune-empty --tag-name-filter cat -- --all
   ```
3. Force push (⚠️ **Use with caution**):
   ```bash
   git push --force --all
   ```

## 📞 Need Help?

- **Security Issues**: security@theusdox.com
- **General Support**: Discord community
- **Documentation**: docs.theusdox.com

---
**Stay secure! 🛡️**