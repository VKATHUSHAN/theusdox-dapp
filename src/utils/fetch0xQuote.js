export async function fetch0xQuote({ sellToken='ETH', buyToken, sellAmount }){
  if(!buyToken) throw new Error('buyToken required')
  const url = `https://api.0x.org/swap/v1/quote?sellToken=${encodeURIComponent(sellToken)}&buyToken=${encodeURIComponent(buyToken)}&sellAmount=${encodeURIComponent(sellAmount)}`
  const res = await fetch(url, { headers: { '0x-api-key': import.meta.env.VITE_OX_API_KEY } })
  if(!res.ok) throw new Error('0x quote failed')
  return res.json()
}
