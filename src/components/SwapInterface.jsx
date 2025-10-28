import React, { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import { USDOXSwapManager, formatNumber } from '../utils/uniswapIntegration'

const SwapInterface = ({ provider, signer, address, onTransactionStart, onTransactionComplete }) => {
  const [swapDirection, setSwapDirection] = useState('buy') // 'buy' or 'sell'
  const [inputAmount, setInputAmount] = useState('')
  const [outputAmount, setOutputAmount] = useState('')
  const [loading, setLoading] = useState(false)
  const [swapping, setSwapping] = useState(false)
  const [quote, setQuote] = useState(null)
  const [usdoxBalance, setUSDOXBalance] = useState('0')
  const [slippage, setSlippage] = useState(0.5)

  const swapManager = useMemo(() => {
    if (!provider || !signer) return null
    return new USDOXSwapManager(provider, signer)
  }, [provider, signer])

  // Fetch USDOX balance
  useEffect(() => {
    if (!swapManager || !address) return

    const fetchBalance = async () => {
      try {
        const balance = await swapManager.getUSDOXBalance(address)
        setUSDOXBalance(balance)
      } catch (error) {
        console.error('Failed to fetch USDOX balance:', error)
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 30000)
    return () => clearInterval(interval)
  }, [swapManager, address])

  // Get quote when input amount changes
  useEffect(() => {
    if (!swapManager || !inputAmount || parseFloat(inputAmount) <= 0) {
      setOutputAmount('')
      setQuote(null)
      return
    }

    const getQuote = async () => {
      setLoading(true)
      try {
        let quoteData
        if (swapDirection === 'buy') {
          quoteData = await swapManager.getUSDOXQuote(inputAmount)
          setOutputAmount(quoteData.usdoxOut)
        } else {
          quoteData = await swapManager.getBNBQuote(inputAmount)
          setOutputAmount(quoteData.bnbOut)
        }
        setQuote(quoteData)
      } catch (error) {
        console.error('Failed to get quote:', error)
        setOutputAmount('')
        setQuote(null)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(getQuote, 500)
    return () => clearTimeout(debounce)
  }, [swapManager, inputAmount, swapDirection])

  const handleSwap = async () => {
    if (!swapManager || !inputAmount || parseFloat(inputAmount) <= 0) return

    setSwapping(true)
    onTransactionStart?.()

    try {
      let tx
      if (swapDirection === 'buy') {
        tx = await swapManager.buyUSDOX(inputAmount, slippage)
      } else {
        tx = await swapManager.sellUSDOX(inputAmount, slippage)
      }

      // Wait for transaction confirmation
      await tx.wait()
      
      onTransactionComplete?.(tx.hash, swapDirection === 'buy' ? 'Bought USDOX' : 'Sold USDOX')
      
      // Reset form
      setInputAmount('')
      setOutputAmount('')
      setQuote(null)
    } catch (error) {
      console.error('Swap failed:', error)
      alert(`Swap failed: ${error.message}`)
    } finally {
      setSwapping(false)
    }
  }

  const toggleSwapDirection = () => {
    setSwapDirection(swapDirection === 'buy' ? 'sell' : 'buy')
    setInputAmount('')
    setOutputAmount('')
    setQuote(null)
  }

  const inputToken = swapDirection === 'buy' ? 'BNB' : 'USDOX'
  const outputToken = swapDirection === 'buy' ? 'USDOX' : 'BNB'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-2xl p-6 border border-gray-700"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Swap Tokens</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSlippage(0.1)}
            className={`px-2 py-1 text-xs rounded ${slippage === 0.1 ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            0.1%
          </button>
          <button
            onClick={() => setSlippage(0.5)}
            className={`px-2 py-1 text-xs rounded ${slippage === 0.5 ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            0.5%
          </button>
          <button
            onClick={() => setSlippage(1)}
            className={`px-2 py-1 text-xs rounded ${slippage === 1 ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
          >
            1%
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="space-y-4">
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">From</span>
            {swapDirection === 'sell' && (
              <span className="text-sm text-gray-400">
                Balance: {formatNumber(usdoxBalance)} USDOX
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              value={inputAmount}
              onChange={(e) => setInputAmount(e.target.value)}
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl text-white placeholder-gray-500 outline-none"
            />
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
              <span className="text-lg">{inputToken === 'BNB' ? '🟡' : '💰'}</span>
              <span className="font-semibold text-white">{inputToken}</span>
            </div>
          </div>
          {swapDirection === 'sell' && (
            <div className="flex justify-end mt-2">
              <button
                onClick={() => setInputAmount(usdoxBalance)}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                MAX
              </button>
            </div>
          )}
        </div>

        {/* Swap Direction Button */}
        <div className="flex justify-center">
          <button
            onClick={toggleSwapDirection}
            className="bg-gray-700 hover:bg-gray-600 rounded-full p-2 transition-colors"
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-gray-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">To</span>
            {loading && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-sm text-gray-400">Getting quote...</span>
              </div>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={outputAmount}
              readOnly
              placeholder="0.0"
              className="flex-1 bg-transparent text-2xl text-white placeholder-gray-500 outline-none"
            />
            <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-3 py-2">
              <span className="text-lg">{outputToken === 'BNB' ? '🟡' : '💰'}</span>
              <span className="font-semibold text-white">{outputToken}</span>
            </div>
          </div>
        </div>

        {/* Quote Information */}
        {quote && (
          <div className="bg-gray-800 rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Price Impact</span>
              <span className={`${quote.priceImpact > 2 ? 'text-red-400' : quote.priceImpact > 1 ? 'text-yellow-400' : 'text-green-400'}`}>
                {quote.priceImpact.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Slippage Tolerance</span>
              <span className="text-white">{slippage}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Minimum Received</span>
              <span className="text-white">
                {formatNumber(parseFloat(outputAmount) * (1 - slippage / 100))} {outputToken}
              </span>
            </div>
          </div>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!inputAmount || !outputAmount || loading || swapping || !address}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-green-400 text-black font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-blue-700 hover:to-green-500 transition-all duration-200"
        >
          {swapping ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
              <span>Swapping...</span>
            </div>
          ) : !address ? (
            'Connect Wallet'
          ) : !inputAmount ? (
            'Enter Amount'
          ) : !outputAmount ? (
            'Getting Quote...'
          ) : (
            `${swapDirection === 'buy' ? 'Buy' : 'Sell'} ${outputToken}`
          )}
        </button>

        {/* Warning for high price impact */}
        {quote && quote.priceImpact > 2 && (
          <div className="flex items-start space-x-2 p-3 bg-red-900/20 border border-red-500 rounded-lg">
            <div className="text-red-400">⚠️</div>
            <div className="text-sm text-red-300">
              High price impact detected ({quote.priceImpact.toFixed(2)}%). Consider reducing your trade size.
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default SwapInterface