// USDOX DApp Configuration
// Environment variables for the application

export const config = {
  // Blockchain Configuration
  bsc: {
    rpc: import.meta.env.VITE_BSC_RPC || 'https://bsc-dataseed1.binance.org/',
    testnetRpc: import.meta.env.VITE_BSC_TESTNET_RPC || 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    chainId: 56,
    chainName: 'Binance Smart Chain',
    currency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    }
  },

  // Smart Contract Addresses
  contracts: {
    usdox: import.meta.env.VITE_USDOX_CONTRACT || '0xf5c470025e99f97a4CA6416c77a685db929e929b',
    rusdox: import.meta.env.VITE_RUSDOX_CONTRACT || '0x213E501dF9E837D64dCb9f04A63b10B063dbD87D',
    stakingReward: import.meta.env.VITE_STAKING_REWARD_CONTRACT || '0x8b4cff1b370cE72F1731580e6238187C385eD772',
    masterChef: import.meta.env.VITE_MASTER_CHEF_CONTRACT || '0x8b4cff1b370cE72F1731580e6238187C385eD772',
    owner1: import.meta.env.VITE_OWNER1_ADDRESS || '0x4969DB5E17a1eE30b3AabC1b5e65aE5D92D0dDC4',
    owner2: import.meta.env.VITE_OWNER2_ADDRESS || '0x39E168359A71D3EFF90f19e8aC0b494913A62f90'
  },

  // API Configuration
  api: {
    alchemyRpc: import.meta.env.VITE_ALCHEMY_RPC || 'https://bnb-mainnet.g.alchemy.com/v2/SnEAFVrH8Z5fFFJi0-qq7',
    infuraRpc: import.meta.env.VITE_INFURA_RPC || 'https://bsc-mainnet.infura.io/v3/8fd26fc2a6554444aa510225df41a31c',
    etherscanApiKey: import.meta.env.VITE_ETHERSCAN_API_KEY || 'HUQJXEIYD4YFZS51D9QQWMHUXI6VKJM3Y2',
    coinMarketCapApiKey: import.meta.env.VITE_COINMARKETCAP_API_KEY || '48ecc47c-f972-4723-82ba-7273e78a2db4'
  },

  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'TheUSDOX',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    description: import.meta.env.VITE_APP_DESCRIPTION || 'The On-Chain Dollar Revolution',
    domain: import.meta.env.VITE_DOMAIN || 'theusdox.com',
    developerEmail: import.meta.env.VITE_DEVELOPER_EMAIL || 'hello@theusdox.com',
    environment: import.meta.env.VITE_ENVIRONMENT || 'production',
    debug: import.meta.env.VITE_DEBUG === 'true',
    network: import.meta.env.VITE_NETWORK || 'bsc-mainnet'
  },

  // Social Media Links
  social: {
    twitter: import.meta.env.VITE_TWITTER_URL || 'https://x.com/TheUSDOXs',
    telegram: import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/theusdox',
    discord: import.meta.env.VITE_DISCORD_URL || 'https://discord.gg/K49Nu2Jbz',
    github: import.meta.env.VITE_GITHUB_URL || 'https://github.com/theusdox'
  }
};

// Helper functions
export const getContractAddress = (contractName) => {
  return config.contracts[contractName];
};

export const getNetworkConfig = () => {
  return config.bsc;
};

export const isProduction = () => {
  return config.app.environment === 'production';
};

export const isDevelopment = () => {
  return config.app.environment === 'development';
};

export const getApiUrl = (service) => {
  return config.api[service];
};

// Export default config
export default config;