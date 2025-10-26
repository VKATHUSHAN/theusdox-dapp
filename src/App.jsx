import React, { Suspense } from 'react'
import ThreeBackground from './components/ThreeBackground'
import useWallet from './hooks/useWallet'
import { fetch0xQuote } from './utils/fetch0xQuote'

export default function App(){
  const { address, connected, readableBalance, connect } = useWallet()

  async function handleBuy(){
    if(!connected) return connect()
    try{
      const sellAmount = (0.01 * 1e18).toString()
      const quote = await fetch0xQuote({ sellToken:'ETH', buyToken: import.meta.env.VITE_USDOX_CONTRACT, sellAmount })
      console.log('quote', quote)
      alert('Quote fetched — see console.')
    }catch(e){ console.error(e); alert('Quote failed') }
  }

  return (
    <div className="min-h-screen relative bg-black text-white">
      <Suspense fallback={<div className="absolute inset-0 z-0 bg-cosmic"/>}>
        <ThreeBackground />
      </Suspense>

      <div className="relative z-10 max-w-6xl mx-auto p-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/usdox-logo.png" alt="TheUSDOX" className="h-12" />
            <div>
              <div className="font-bold text-lg">TheUSDOX</div>
              <div className="text-xs text-gray-300">The On-Chain Dollar</div>
            </div>
          </div>
          <div>
            {!connected ? (
              <button onClick={()=>connect().catch(()=>alert('connect failed'))} className="px-4 py-2 rounded bg-gradient-to-r from-blue-600 to-green-400 text-black">Connect</button>
            ) : (
              <div className="bg-white/5 px-3 py-2 rounded">{address.slice(0,6)}...{address.slice(-4)} — {readableBalance} ETH</div>
            )}
          </div>
        </nav>

        <header className="mt-16 grid md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7">
            <h1 className="text-5xl font-extrabold">TheUSDOX — The On‑Chain Dollar</h1>
            <p className="mt-4 text-gray-300 max-w-xl">Fast. Stable. Auditable. Built for institutions and merchants.</p>
            <div className="mt-6 flex gap-4">
              <button onClick={handleBuy} className="px-6 py-3 rounded bg-gradient-to-r from-blue-600 to-green-400 text-black">Buy USDOX</button>
            </div>
          </div>
        </header>

      </div>
    </div>
  )
}
