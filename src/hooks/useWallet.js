import { useState, useEffect, useCallback, useMemo } from 'react'
import { ethers } from 'ethers'

export default function useWallet(){
  const [address, setAddress] = useState(null)
  const [connected, setConnected] = useState(false)
  const [balance, setBalance] = useState(ethers.BigNumber.from(0))

  useEffect(()=>{
    if(typeof window === 'undefined') return
    const eth = window.ethereum
    if(!eth || !eth.request) return

    let mounted = true

    eth.request({ method: 'eth_accounts' })
      .then(accounts => { if(mounted && accounts && accounts.length){ setAddress(accounts[0]); setConnected(true) } })
      .catch(()=>{})

    const onAccountsChanged = (accs)=>{
      if(!mounted) return
      if(!accs || accs.length===0){ setAddress(null); setConnected(false); setBalance(ethers.BigNumber.from(0)) }
      else { setAddress(accs[0]); setConnected(true) }
    }

    eth.on && eth.on('accountsChanged', onAccountsChanged)
    return ()=>{ mounted=false; try{ eth.removeListener && eth.removeListener('accountsChanged', onAccountsChanged) }catch(e){} }
  },[])

  useEffect(()=>{
    let mounted = true
    async function fetchBal(){
      if(typeof window === 'undefined') return
      if(!address) return
      try{
        const balHex = await window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] })
        const bn = ethers.BigNumber.from(balHex)
        if(mounted) setBalance(bn)
      }catch(e){}
    }
    fetchBal()
    const iv = setInterval(fetchBal,30000)
    return ()=>{ mounted=false; clearInterval(iv) }
  },[address])

  const connect = useCallback(async ()=>{
    if(typeof window === 'undefined' || !window.ethereum) throw new Error('No provider')
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    if(accounts && accounts.length){ setAddress(accounts[0]); setConnected(true) }
  },[])

  const disconnect = useCallback(()=>{ setAddress(null); setConnected(false); setBalance(ethers.BigNumber.from(0)) },[])

  const readableBalance = useMemo(()=>{
    try{ return parseFloat(ethers.utils.formatEther(balance)).toFixed(4) }catch(e){ return '0.0000' }
  },[balance])

  return { address, connected, balance, readableBalance, connect, disconnect }
}
