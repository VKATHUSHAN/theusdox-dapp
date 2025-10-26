export const CHAINS = {
  '1': { id: 1, name: 'Ethereum', rpc: `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_KEY}`, hex: '0x1' },
  '56': { id: 56, name: 'BNB Smart Chain', rpc: import.meta.env.VITE_BSC_RPC || 'https://bsc-dataseed.binance.org/', hex: '0x38' },
  '10': { id: 10, name: 'Optimism', rpc: 'https://mainnet.optimism.io', hex: '0xa' }
}
