export const COOKIE_CHAIN_CONFIG = {
  name: 'Cookie Chain',
  ticker: 'COOK',
  decimals: 9,
  rpcUrl: 'https://rpc.cookiescan.io',
  wsUrl: 'wss://rpc.cookiescan.io',
  genesisHash: '9wDaBRDgArEUpvhHxGguNkwozsZh4UpGZB9o2EoEcBB2',
  explorerUrl: 'https://cookiescan.io',
  memoProgramId: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
  bridgeUrl: 'https://hyperlane.cookiescan.io',
  swapUrl: 'https://swap.cookiescan.io',
  cookieboxApi: 'https://agg.cookiebox.app',
  cookieDasApi: 'https://api.cookiescan.io',
  docsUrl: 'https://docs.cookiechain.wtf',
} as const

/**
 * Switch network helper specifically for Nightly Wallet
 */
export async function switchNightlyToCookieChain(): Promise<boolean> {
  try {
    const nightly = (window as unknown as { nightly?: { solana?: { changeNetwork?: (params: { genesisHash: string; url: string }) => Promise<void> } } }).nightly
    if (nightly?.solana?.changeNetwork) {
      await nightly.solana.changeNetwork({
        genesisHash: COOKIE_CHAIN_CONFIG.genesisHash,
        url: COOKIE_CHAIN_CONFIG.rpcUrl,
      })
      return true
    }
    return false
  } catch (err) {
    console.warn('Failed to auto-switch network in Nightly:', err)
    return false
  }
}
