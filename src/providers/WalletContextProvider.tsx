import React, { useMemo } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { COOKIE_CHAIN_CONFIG } from '../config/network'

// Default wallet adapter styles
import '@solana/wallet-adapter-react-ui/styles.css'

interface Props {
  children: React.ReactNode
}

export const WalletContextProvider: React.FC<Props> = ({ children }) => {
  // Hardcoded Cookie Chain RPC endpoint - never defaults to Solana mainnet
  const endpoint = useMemo(() => COOKIE_CHAIN_CONFIG.rpcUrl, [])

  // Modern wallets (Nightly, Phantom, Solflare) are auto-discovered via Wallet Standard
  const wallets = useMemo(() => [], [])

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{
        commitment: 'confirmed',
        wsEndpoint: COOKIE_CHAIN_CONFIG.wsUrl,
      }}
    >
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
