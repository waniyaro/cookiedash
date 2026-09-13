import React, { useMemo, useState } from 'react'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalContext } from '@solana/wallet-adapter-react-ui'
import { COOKIE_CHAIN_CONFIG } from '../config/network'
import { CookieWalletModal } from '../components/CookieWalletModal'

// Default styles for WalletMultiButton dropdown menu
import '@solana/wallet-adapter-react-ui/styles.css'

interface Props {
  children: React.ReactNode
}

export const WalletContextProvider: React.FC<Props> = ({ children }) => {
  // Hardcoded Cookie Chain RPC endpoint - never defaults to Solana mainnet
  const endpoint = useMemo(() => COOKIE_CHAIN_CONFIG.rpcUrl, [])

  // Modern wallets (Nightly, Phantom, Solflare) are auto-discovered via Wallet Standard
  const wallets = useMemo(() => [], [])

  const [visible, setVisible] = useState(false)

  return (
    <ConnectionProvider
      endpoint={endpoint}
      config={{
        commitment: 'confirmed',
        wsEndpoint: COOKIE_CHAIN_CONFIG.wsUrl,
      }}
    >
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalContext.Provider value={{ visible, setVisible }}>
          {children}
          <CookieWalletModal isOpen={visible} onClose={() => setVisible(false)} />
        </WalletModalContext.Provider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

