import { useState, useEffect, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import { MetaMaskSDK } from "@metamask/sdk";

// Initialize MetaMask SDK
const MMSDK = new MetaMaskSDK({
  dappMetadata: {
    name: "TheUSDOX DApp",
    url: window.location.href,
  },
});

export default function useAdvancedWallet() {
  const [address, setAddress] = useState(null);
  const [connected, setConnected] = useState(false);
  const [balance, setBalance] = useState(ethers.BigNumber.from(0));
  const [provider, setProvider] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [walletType, setWalletType] = useState(null); // 'metamask', 'walletconnect', 'injected'

  // BSC Network Configuration
  const BSC_MAINNET = {
    chainId: "0x38",
    chainName: "BNB Smart Chain",
    nativeCurrency: {
      name: "BNB",
      symbol: "BNB",
      decimals: 18,
    },
    rpcUrls: ["https://bsc-dataseed.binance.org/"],
    blockExplorerUrls: ["https://bscscan.com/"],
  };

  const BSC_TESTNET = {
    chainId: "0x61",
    chainName: "BNB Smart Chain Testnet",
    nativeCurrency: {
      name: "tBNB",
      symbol: "tBNB",
      decimals: 18,
    },
    rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
    blockExplorerUrls: ["https://testnet.bscscan.com/"],
  };

  // Initialize and check for existing connections
  useEffect(() => {
    if (typeof window === "undefined") return;

    let mounted = true;

    const initializeProvider = async () => {
      try {
        // Check for MetaMask first
        if (window.ethereum) {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);

          // Check if already connected
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          const chainId = await window.ethereum.request({
            method: "eth_chainId",
          });

          if (mounted && accounts && accounts.length > 0) {
            setAddress(accounts[0]);
            setConnected(true);
            setChainId(chainId);
            setWalletType("metamask");
          }
        }
      } catch (error) {
        console.error("Failed to initialize provider:", error);
      }
    };

    initializeProvider();

    // Set up event listeners for MetaMask
    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (!mounted) return;
        if (!accounts || accounts.length === 0) {
          setAddress(null);
          setConnected(false);
          setBalance(ethers.BigNumber.from(0));
          setWalletType(null);
        } else {
          setAddress(accounts[0]);
          setConnected(true);
          setWalletType("metamask");
        }
      };

      const handleChainChanged = (chainId) => {
        if (!mounted) return;
        setChainId(chainId);
        window.location.reload(); // Recommended by MetaMask
      };

      const handleConnect = (connectInfo) => {
        if (!mounted) return;
        setConnected(true);
        setChainId(connectInfo.chainId);
      };

      const handleDisconnect = () => {
        if (!mounted) return;
        setAddress(null);
        setConnected(false);
        setBalance(ethers.BigNumber.from(0));
        setWalletType(null);
      };

      if (window.ethereum.on) {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
        window.ethereum.on("chainChanged", handleChainChanged);
        window.ethereum.on("connect", handleConnect);
        window.ethereum.on("disconnect", handleDisconnect);
      }

      return () => {
        mounted = false;
        try {
          if (window.ethereum.removeListener) {
            window.ethereum.removeListener(
              "accountsChanged",
              handleAccountsChanged
            );
            window.ethereum.removeListener("chainChanged", handleChainChanged);
            window.ethereum.removeListener("connect", handleConnect);
            window.ethereum.removeListener("disconnect", handleDisconnect);
          }
        } catch (error) {
          console.error("Failed to remove event listeners:", error);
        }
      };
    }

    return () => {
      mounted = false;
    };
  }, []);

  // Fetch balance when address changes
  useEffect(() => {
    let mounted = true;

    async function fetchBalance() {
      if (!provider || !address) return;

      try {
        const balance = await provider.getBalance(address);
        if (mounted) setBalance(balance);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    }

    fetchBalance();
    const interval = setInterval(fetchBalance, 30000); // Update every 30 seconds

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [provider, address]);

  // Connect to MetaMask
  const connectMetaMask = useCallback(async () => {
    if (connecting) return;

    setConnecting(true);
    try {
      if (!window.ethereum) {
        // Try to connect using MetaMask SDK
        const ethereum = MMSDK.getProvider();
        if (ethereum) {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });
          const provider = new ethers.providers.Web3Provider(ethereum);

          setProvider(provider);
          setAddress(accounts[0]);
          setConnected(true);
          setWalletType("metamask");

          const chainId = await ethereum.request({ method: "eth_chainId" });
          setChainId(chainId);
        } else {
          throw new Error(
            "MetaMask not found. Please install MetaMask browser extension."
          );
        }
      } else {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);

        setProvider(provider);
        setAddress(accounts[0]);
        setConnected(true);
        setWalletType("metamask");

        const chainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        setChainId(chainId);
      }
    } catch (error) {
      console.error("Failed to connect to MetaMask:", error);
      throw error;
    } finally {
      setConnecting(false);
    }
  }, [connecting]);

  // Switch to BSC Network
  const switchToBSC = useCallback(async (testnet = false) => {
    if (!window.ethereum) throw new Error("MetaMask not found");

    const network = testnet ? BSC_TESTNET : BSC_MAINNET;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [network],
          });
        } catch (addError) {
          console.error("Failed to add BSC network:", addError);
          throw addError;
        }
      } else {
        console.error("Failed to switch to BSC network:", switchError);
        throw switchError;
      }
    }
  }, []);

  // Add USDOX Token to wallet
  const addUSDOXToken = useCallback(async () => {
    if (!window.ethereum) throw new Error("MetaMask not found");

    try {
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: import.meta.env.VITE_USDOX_CONTRACT,
            symbol: "USDOX",
            decimals: 18,
            image: `${window.location.origin}/usdox-logo.png`,
          },
        },
      });
    } catch (error) {
      console.error("Failed to add USDOX token:", error);
      throw error;
    }
  }, []);

  // Disconnect wallet
  const disconnect = useCallback(() => {
    setAddress(null);
    setConnected(false);
    setBalance(ethers.BigNumber.from(0));
    setProvider(null);
    setChainId(null);
    setWalletType(null);
  }, []);

  // Get readable balance
  const readableBalance = useMemo(() => {
    try {
      return parseFloat(ethers.utils.formatEther(balance)).toFixed(4);
    } catch (error) {
      return "0.0000";
    }
  }, [balance]);

  // Check if connected to BSC
  const isOnBSC = useMemo(() => {
    return chainId === "0x38" || chainId === "0x61";
  }, [chainId]);

  // Get network name
  const networkName = useMemo(() => {
    switch (chainId) {
      case "0x1":
        return "Ethereum Mainnet";
      case "0x38":
        return "BSC Mainnet";
      case "0x61":
        return "BSC Testnet";
      case "0x89":
        return "Polygon";
      case "0xa4b1":
        return "Arbitrum";
      default:
        return "Unknown Network";
    }
  }, [chainId]);

  return {
    // Connection state
    address,
    connected,
    connecting,
    balance,
    readableBalance,
    provider,
    chainId,
    networkName,
    walletType,
    isOnBSC,

    // Connection methods
    connectMetaMask,
    disconnect,

    // Network methods
    switchToBSC,
    addUSDOXToken,
  };
}
