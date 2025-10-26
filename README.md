# TheUSDOX DApp

Vite + React scaffold for TheUSDOX landing page and DApp with Web3 integration.

## 🚀 Quick Start with GitHub Codespaces

The fastest way to get started is using GitHub Codespaces:

1. Click the green "Code" button → "Codespaces" → "Create codespace on main"
2. Wait for the environment to be set up automatically
3. The development server will start automatically on port 5173
4. Start building!

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new)

## 🛠️ Local Development Setup

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill keys.
3. Put `usdox-logo.png` into `public/`.
4. Run local dev server: `npm run dev`

## 🐳 Development Container

This project includes a development container configuration for consistent development environments:

- **VS Code Dev Containers**: Open the project in VS Code and select "Reopen in Container"
- **Pre-configured extensions**: ESLint, Prettier, Tailwind CSS, WalletConnect tools
- **Automatic port forwarding**: Development server accessible at `localhost:5173`

## 📝 Notes

- This scaffold uses ethers.js and plain window.ethereum for wallet connect.
- For WalletConnect or Web3Modal, install and wire your WalletConnect project id.
- The project includes CI/CD workflows for automated testing and deployment.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

See our [Contributing Guidelines](CONTRIBUTING.md) for more details.
