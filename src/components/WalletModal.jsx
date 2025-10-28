import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WalletModal = ({ isOpen, onClose, onConnect }) => {
  const [connecting, setConnecting] = useState(false);

  const walletOptions = [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "🦊",
      description: "Connect using MetaMask browser extension or mobile app",
      popular: true,
    },
    {
      id: "walletconnect",
      name: "WalletConnect",
      icon: "🔗",
      description: "Scan with mobile wallet to connect",
      popular: false,
    },
    {
      id: "injected",
      name: "Browser Wallet",
      icon: "🌐",
      description: "Connect with any injected wallet",
      popular: false,
    },
  ];

  const handleConnect = async (walletId) => {
    setConnecting(true);
    try {
      await onConnect(walletId);
      onClose();
    } catch (error) {
      console.error(`Failed to connect ${walletId}:`, error);
      alert(`Failed to connect ${walletId}: ${error.message}`);
    } finally {
      setConnecting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-gray-900 rounded-2xl p-6 max-w-md w-full mx-4 border border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Connect Wallet</h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="space-y-3">
              {walletOptions.map((wallet) => (
                <motion.button
                  key={wallet.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleConnect(wallet.id)}
                  disabled={connecting}
                  className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 hover:border-blue-500 transition-all duration-200 text-left disabled:opacity-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{wallet.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-white">
                          {wallet.name}
                        </span>
                        {wallet.popular && (
                          <span className="px-2 py-1 text-xs bg-blue-600 text-white rounded-full">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {wallet.description}
                      </p>
                    </div>
                    {connecting ? (
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    ) : (
                      <svg
                        className="w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-xl">
              <div className="flex items-start space-x-3">
                <div className="text-blue-400">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white mb-1">
                    New to DeFi?
                  </h4>
                  <p className="text-xs text-gray-400">
                    We recommend MetaMask for beginners. It's secure, easy to
                    use, and works great with USDOX.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WalletModal;
