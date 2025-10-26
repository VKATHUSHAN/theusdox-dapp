# TheUSDOX DApp 🚀

> **The On-Chain Dollar Revolution** - A decentralized, transparent, and yield-bearing stablecoin ecosystem built on blockchain technology.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-blue.svg)](https://nextjs.org/)
[![Hardhat](https://img.shields.io/badge/Hardhat-Ready-orange.svg)](https://hardhat.org/)

## 🌟 Project Overview

USDOX is a revolutionary DeFi protocol featuring:

- **🏦 Multi-Collateral Lending Vault** - Deposit various crypto assets and mint USDOX stablecoins
- **📊 Dynamic Price Oracles** - Real-time price feeds powered by Chainlink
- **💰 Yield-Bearing Stablecoin** - Earn rewards while holding USDOX
- **🌐 Cross-Chain Compatible** - Deployed on BSC, Ethereum, and other major networks
- **🎨 Modern Web Interface** - Beautiful, responsive DApp built with Next.js

## 🏗️ Architecture

```
├── 📂 USDOXVault/           # Smart Contracts (Hardhat)
│   ├── contracts/           # Solidity smart contracts
│   ├── scripts/            # Deployment scripts
│   └── test/               # Contract tests
├── 📂 website/             # Frontend DApp (Next.js)
│   ├── src/pages/          # React pages
│   ├── src/styles/         # CSS styles
│   └── public/             # Static assets
└── 📂 src/                 # Vite React components
```

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** and **npm**
- **Git** for version control
- **MetaMask** or compatible Web3 wallet

### 1. Clone & Setup

```bash
git clone https://github.com/VKATHUSHAN/theusdox-dapp.git
cd theusdox-dapp

# Install dependencies
npm install
cd USDOXVault && npm install
cd ../website && npm install
```

### 2. Environment Configuration

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your API keys:
# - Alchemy/Infura API keys
# - WalletConnect Project ID  
# - Contract addresses (after deployment)
```

### 3. Smart Contract Deployment

```bash
cd USDOXVault
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network bsc-testnet
```

### 4. Launch the Website

```bash
cd ../website
npm run dev
```

Visit `http://localhost:3000` to see your DApp in action! 🎉

## 🚀 GitHub Codespaces (Recommended)

The fastest way to get started is using GitHub Codespaces:

1. Click the green "Code" button → "Codespaces" → "Create codespace on main"
2. Wait for the environment to be set up automatically
3. The development server will start automatically
4. Start building!

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/VKATHUSHAN/theusdox-dapp)

## � Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_BSC_RPC` | BSC RPC endpoint | ✅ |
| `VITE_USDOX_CONTRACT` | USDOX token contract address | ✅ |
| `VITE_VAULT_CONTRACT` | Vault contract address | ✅ |
| `VITE_ALCHEMY_KEY` | Alchemy API key | ✅ |
| `VITE_WALLETCONNECT_PROJECT_ID` | WalletConnect project ID | ✅ |

## �️ Development

### Smart Contracts

```bash
cd USDOXVault

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to testnet
npx hardhat run scripts/deploy.js --network bsc-testnet

# Verify contracts
npx hardhat verify --network bsc-testnet [CONTRACT_ADDRESS]
```

### Frontend Development

```bash
cd website

# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📱 Features

### 🔐 Smart Contract Features
- **ERC20 USDOX Token** with minting/burning controls
- **Multi-Collateral Vault** supporting ETH, BTC, USDC, and more
- **Chainlink Price Oracles** for accurate asset pricing
- **Liquidation System** for maintaining protocol health
- **Governance Token** for decentralized decision making

### 🎨 Web Interface Features
- **Wallet Integration** (MetaMask, WalletConnect, Coinbase)
- **Real-time Portfolio** tracking
- **Interactive Charts** and analytics
- **Mobile Responsive** design
- **Particle Animation** backgrounds

## 🌐 Deployment

### Vercel Deployment (Recommended)

```bash
cd website
npm run build
npx vercel --prod
```

### Custom Domain Setup

1. Configure your domain DNS to point to Vercel
2. Add domain in Vercel dashboard
3. Update `VITE_DOMAIN=theusdox.com` in environment variables

## 🔗 Links

- **Website**: [theusdox.com](https://theusdox.com)
- **Documentation**: [docs.theusdox.com](https://docs.theusdox.com)
- **Twitter**: [@theusdox](https://twitter.com/theusdox)
- **Discord**: [Join Community](https://discord.gg/usdox)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## ⚠️ Security

For security concerns, please email: security@theusdox.com

---

**Built with ❤️ by the USDOX Team**
