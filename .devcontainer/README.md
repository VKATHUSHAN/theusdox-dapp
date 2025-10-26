# TheUSDOX DApp - Development Container Setup

This repository includes a development container configuration that provides a consistent development environment for the TheUSDOX DApp project.

## Features

- **Node.js 18** runtime environment
- **Pre-installed extensions** for React, Tailwind CSS, and Web3 development
- **Port forwarding** for Vite dev server (5173)
- **Automatic dependency installation**
- **Git and GitHub CLI** integration
- **Docker-in-Docker** support

## Getting Started

### Using GitHub Codespaces

1. Click the green "Code" button on the GitHub repository
2. Select "Codespaces" tab
3. Click "Create codespace on main"
4. Wait for the environment to be set up automatically

### Using VS Code with Dev Containers

1. Install the "Dev Containers" extension in VS Code
2. Clone this repository locally
3. Open the repository in VS Code
4. When prompted, click "Reopen in Container"
5. Wait for the container to build and start

## Development Commands

Once the container is running, you can use these commands:

```bash
# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview
```

## Port Access

- **Vite Dev Server**: `http://localhost:5173`
- The port will be automatically forwarded and accessible from your browser

## Installed VS Code Extensions

- Prettier - Code formatter
- ESLint - JavaScript linter
- Tailwind CSS IntelliSense
- Auto Rename Tag
- Path Intellisense
- WalletConnect Developer Tools
- And more...

## Environment Variables

The container sets `NODE_ENV=development` by default. You can add more environment variables in the `devcontainer.json` file as needed.

## Customization

To customize the development environment:

1. Edit `.devcontainer/devcontainer.json` for VS Code settings and extensions
2. Edit `.devcontainer/Dockerfile` for additional tools and dependencies
3. Commit your changes to make them available to all team members