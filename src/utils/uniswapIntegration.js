import { ethers } from "ethers";

// Uniswap V2 Router on BSC (PancakeSwap)
const PANCAKESWAP_ROUTER = "0x10ED43C718714eb63d5aA57B78B54704E256024E";
const WBNB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";

// Simplified Uniswap/PancakeSwap Router ABI
const ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
];

// ERC20 ABI for token operations
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
];

export class USDOXSwapManager {
  constructor(provider, signer) {
    this.provider = provider;
    this.signer = signer;
    this.router = new ethers.Contract(PANCAKESWAP_ROUTER, ROUTER_ABI, signer);
  }

  // Get quote for swapping BNB to USDOX
  async getUSDOXQuote(bnbAmount) {
    try {
      const amountIn = ethers.utils.parseEther(bnbAmount.toString());
      const path = [WBNB, import.meta.env.VITE_USDOX_CONTRACT];

      const amounts = await this.router.getAmountsOut(amountIn, path);
      return {
        bnbIn: ethers.utils.formatEther(amounts[0]),
        usdoxOut: ethers.utils.formatEther(amounts[1]),
        priceImpact: this.calculatePriceImpact(amounts[0], amounts[1]),
      };
    } catch (error) {
      console.error("Failed to get USDOX quote:", error);
      throw error;
    }
  }

  // Get quote for swapping USDOX to BNB
  async getBNBQuote(usdoxAmount) {
    try {
      const amountIn = ethers.utils.parseEther(usdoxAmount.toString());
      const path = [import.meta.env.VITE_USDOX_CONTRACT, WBNB];

      const amounts = await this.router.getAmountsOut(amountIn, path);
      return {
        usdoxIn: ethers.utils.formatEther(amounts[0]),
        bnbOut: ethers.utils.formatEther(amounts[1]),
        priceImpact: this.calculatePriceImpact(amounts[0], amounts[1]),
      };
    } catch (error) {
      console.error("Failed to get BNB quote:", error);
      throw error;
    }
  }

  // Buy USDOX with BNB
  async buyUSDOX(bnbAmount, slippageTolerance = 0.5) {
    try {
      const amountIn = ethers.utils.parseEther(bnbAmount.toString());
      const path = [WBNB, import.meta.env.VITE_USDOX_CONTRACT];

      // Get expected output
      const amounts = await this.router.getAmountsOut(amountIn, path);
      const amountOutMin = amounts[1]
        .mul(100 - slippageTolerance * 100)
        .div(100);

      // Calculate deadline (20 minutes from now)
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      const tx = await this.router.swapExactETHForTokens(
        amountOutMin,
        path,
        await this.signer.getAddress(),
        deadline,
        { value: amountIn }
      );

      return tx;
    } catch (error) {
      console.error("Failed to buy USDOX:", error);
      throw error;
    }
  }

  // Sell USDOX for BNB
  async sellUSDOX(usdoxAmount, slippageTolerance = 0.5) {
    try {
      const usdoxContract = new ethers.Contract(
        import.meta.env.VITE_USDOX_CONTRACT,
        ERC20_ABI,
        this.signer
      );

      const amountIn = ethers.utils.parseEther(usdoxAmount.toString());

      // Check allowance
      const allowance = await usdoxContract.allowance(
        await this.signer.getAddress(),
        PANCAKESWAP_ROUTER
      );

      // Approve if necessary
      if (allowance.lt(amountIn)) {
        const approveTx = await usdoxContract.approve(
          PANCAKESWAP_ROUTER,
          amountIn
        );
        await approveTx.wait();
      }

      const path = [import.meta.env.VITE_USDOX_CONTRACT, WBNB];

      // Get expected output
      const amounts = await this.router.getAmountsOut(amountIn, path);
      const amountOutMin = amounts[1]
        .mul(100 - slippageTolerance * 100)
        .div(100);

      // Calculate deadline (20 minutes from now)
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20;

      const tx = await this.router.swapExactTokensForETH(
        amountIn,
        amountOutMin,
        path,
        await this.signer.getAddress(),
        deadline
      );

      return tx;
    } catch (error) {
      console.error("Failed to sell USDOX:", error);
      throw error;
    }
  }

  // Get USDOX token balance
  async getUSDOXBalance(address) {
    try {
      const usdoxContract = new ethers.Contract(
        import.meta.env.VITE_USDOX_CONTRACT,
        ERC20_ABI,
        this.provider
      );

      const balance = await usdoxContract.balanceOf(address);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error("Failed to get USDOX balance:", error);
      return "0";
    }
  }

  // Calculate approximate price impact
  calculatePriceImpact(amountIn, amountOut) {
    try {
      // This is a simplified calculation
      // In a real implementation, you'd compare with the spot price
      const ratio = amountOut.mul(100).div(amountIn);
      return Math.max(0, 100 - ratio.toNumber());
    } catch (error) {
      return 0;
    }
  }

  // Add liquidity (for advanced users)
  async addLiquidity(bnbAmount, usdoxAmount, slippageTolerance = 0.5) {
    try {
      // This would implement adding liquidity to the USDOX/BNB pool
      // For now, we'll just return a placeholder
      throw new Error("Add liquidity feature coming soon!");
    } catch (error) {
      console.error("Failed to add liquidity:", error);
      throw error;
    }
  }
}

// Utility function to format large numbers
export const formatNumber = (value, decimals = 4) => {
  const num = parseFloat(value);
  if (num === 0) return "0";
  if (num < 0.0001) return "< 0.0001";
  if (num < 1) return num.toFixed(decimals);
  if (num < 1000) return num.toFixed(2);
  if (num < 1000000) return `${(num / 1000).toFixed(1)}K`;
  return `${(num / 1000000).toFixed(1)}M`;
};

// Utility function to validate BSC address
export const isValidBSCAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

// Get BSC scan URL for transaction
export const getBSCScanUrl = (txHash, testnet = false) => {
  const baseUrl = testnet
    ? "https://testnet.bscscan.com"
    : "https://bscscan.com";
  return `${baseUrl}/tx/${txHash}`;
};
