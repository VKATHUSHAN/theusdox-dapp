# Use the official Node.js 18 image as base
FROM mcr.microsoft.com/devcontainers/javascript-node:18

# Install additional tools and dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    wget \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install global npm packages useful for React/Web3 development
RUN npm install -g \
    @vitejs/create-vite \
    create-react-app \
    eslint \
    prettier \
    serve

# Set the working directory
WORKDIR /workspace

# Copy package files for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Expose the port that Vite uses
EXPOSE 5173

# Default command
CMD ["npm", "run", "dev"]