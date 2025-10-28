import React, { Suspense, useState } from "react";
import ThreeBackground from "./components/ThreeBackground";
import WalletModal from "./components/WalletModal";
import SwapInterface from "./components/SwapInterface";
import useAdvancedWallet from "./hooks/useAdvancedWallet";
import { getBSCScanUrl } from "./utils/uniswapIntegration";

export default function App() {
  const {
    address,
    connected,
    connecting,
    readableBalance,
    provider,
    networkName,
    isOnBSC,
    walletType,
    connectMetaMask,
    disconnect,
    switchToBSC,
    addUSDOXToken,
  } = useAdvancedWallet();

  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showSwapInterface, setShowSwapInterface] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState(null);

  const handleWalletConnect = async (walletId) => {
    if (walletId === "metamask") {
      await connectMetaMask();
    } else if (walletId === "walletconnect") {
      // WalletConnect integration would go here
      alert("WalletConnect integration coming soon!");
    } else if (walletId === "injected") {
      // Try to connect with any injected wallet
      await connectMetaMask();
    }
  };

  const handleSwitchToBSC = async () => {
    try {
      await switchToBSC(false); // Switch to BSC Mainnet
    } catch (error) {
      alert(`Failed to switch to BSC: ${error.message}`);
    }
  };

  const handleAddUSDOXToken = async () => {
    try {
      await addUSDOXToken();
      alert("USDOX token added to your wallet!");
    } catch (error) {
      alert(`Failed to add USDOX token: ${error.message}`);
    }
  };

  const handleTransactionStart = () => {
    setTransactionStatus({
      type: "pending",
      message: "Transaction pending...",
    });
  };

  const handleTransactionComplete = (txHash, action) => {
    setTransactionStatus({
      type: "success",
      message: `${action} successful!`,
      txHash,
    });
    setTimeout(() => setTransactionStatus(null), 5000);
  };

  return (
    <div className="min-h-screen relative bg-black text-white">
      <Suspense fallback={<div className="absolute inset-0 z-0 bg-cosmic" />}>
        <ThreeBackground />
      </Suspense>

      {/* Transaction Status Notification */}
      {transactionStatus && (
        <div className="fixed top-4 right-4 z-50 bg-gray-900 border border-gray-700 rounded-lg p-4 max-w-sm">
          <div className="flex items-center space-x-2">
            {transactionStatus.type === "pending" ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
            ) : (
              <div className="text-green-400">✅</div>
            )}
            <span className="text-sm">{transactionStatus.message}</span>
          </div>
          {transactionStatus.txHash && (
            <a
              href={getBSCScanUrl(transactionStatus.txHash)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-400 hover:text-blue-300 text-xs mt-1 block"
            >
              View on BSCScan →
            </a>
          )}
        </div>
      )}

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/usdox-logo.png" alt="TheUSDOX" className="h-12" />
            <div>
              <div className="font-bold text-lg">TheUSDOX</div>
              <div className="text-xs text-gray-300">The On-Chain Dollar</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {!connected ? (
              <button
                onClick={() => setShowWalletModal(true)}
                disabled={connecting}
                className="px-4 py-2 rounded bg-gradient-to-r from-blue-600 to-green-400 text-black font-semibold disabled:opacity-50"
              >
                {connecting ? "Connecting..." : "Connect Wallet"}
              </button>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  {!isOnBSC && (
                    <button
                      onClick={handleSwitchToBSC}
                      className="px-3 py-1 text-xs bg-yellow-600 text-black rounded hover:bg-yellow-500"
                    >
                      Switch to BSC
                    </button>
                  )}
                  <div className="bg-white/5 px-3 py-2 rounded-lg">
                    <div className="text-xs text-gray-400">{networkName}</div>
                    <div className="font-mono text-sm">
                      {address.slice(0, 6)}...{address.slice(-4)} —{" "}
                      {readableBalance} {isOnBSC ? "BNB" : "ETH"}
                    </div>
                  </div>
                  <button
                    onClick={disconnect}
                    className="px-3 py-2 text-sm text-gray-400 hover:text-white border border-gray-600 rounded hover:border-gray-500"
                  >
                    Disconnect
                  </button>
                </div>
              </>
            )}
          </div>
        </nav>

        <header className="mt-16 grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-5xl font-extrabold leading-tight">
              TheUSDOX —<br />
              <span className="bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
                The On‑Chain Dollar
              </span>
            </h1>
            <p className="mt-6 text-xl text-gray-300 leading-relaxed">
              Fast. Stable. Auditable. Built for institutions and merchants who
              demand reliability in DeFi.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => setShowSwapInterface(!showSwapInterface)}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-green-400 text-black font-bold hover:from-blue-700 hover:to-green-500 transition-all duration-200"
              >
                {showSwapInterface ? "Hide Swap" : "Buy/Sell USDOX"}
              </button>

              {connected && isOnBSC && (
                <button
                  onClick={handleAddUSDOXToken}
                  className="px-6 py-3 rounded-xl border border-gray-600 hover:border-gray-500 text-white transition-all duration-200"
                >
                  Add USDOX to Wallet
                </button>
              )}
            </div>

            {/* Features */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">⚡</div>
                <div className="font-semibold">Lightning Fast</div>
                <div className="text-sm text-gray-400">
                  Sub-second transactions
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🔒</div>
                <div className="font-semibold">Ultra Secure</div>
                <div className="text-sm text-gray-400">
                  Audited smart contracts
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">💰</div>
                <div className="font-semibold">Always $1</div>
                <div className="text-sm text-gray-400">
                  Stable value guaranteed
                </div>
              </div>
            </div>
          </div>

          {/* Swap Interface */}
          {showSwapInterface && connected && provider && (
            <div>
              <SwapInterface
                provider={provider}
                signer={provider.getSigner()}
                address={address}
                onTransactionStart={handleTransactionStart}
                onTransactionComplete={handleTransactionComplete}
              />
            </div>
          )}
        </header>

        {/* Network Warning */}
        {connected && !isOnBSC && (
          <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-500 rounded-xl">
            <div className="flex items-start space-x-3">
              <div className="text-yellow-400">⚠️</div>
              <div>
                <div className="font-semibold text-yellow-300">
                  Wrong Network
                </div>
                <div className="text-sm text-yellow-200 mt-1">
                  USDOX is available on BSC (Binance Smart Chain). Please switch
                  to BSC to use the swap features.
                </div>
                <button
                  onClick={handleSwitchToBSC}
                  className="mt-2 px-4 py-2 bg-yellow-600 text-black rounded-lg hover:bg-yellow-500 font-semibold"
                >
                  Switch to BSC Network
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Wallet Connection Modal */}
      <WalletModal
        isOpen={showWalletModal}
        onClose={() => setShowWalletModal(false)}
        onConnect={handleWalletConnect}
      />
    </div>
  );
}
