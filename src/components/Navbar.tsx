import React, { useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { ArrowUpRight, CheckCircle2, Shield, Compass } from 'lucide-react'
import { COOKIE_CHAIN_CONFIG, switchNightlyToCookieChain } from '../config/network'

export const Navbar: React.FC = () => {
  const { wallet } = useWallet()
  const [switchingNetwork, setSwitchingNetwork] = useState(false)
  const [switchSuccess, setSwitchSuccess] = useState(false)

  const handleSwitchNetwork = async () => {
    setSwitchingNetwork(true)
    const success = await switchNightlyToCookieChain()
    setSwitchingNetwork(false)
    if (success) {
      setSwitchSuccess(true)
      setTimeout(() => setSwitchSuccess(false), 3000)
    }
  }

  const isNightly = wallet?.adapter.name.toLowerCase().includes('nightly')

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0d0907]/90 border-b border-[#38261e]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 py-3 flex items-center justify-between gap-4">
        {/* Brand with Cookie Chain Sticker */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 group cursor-pointer select-none"
        >
          <div className="relative w-9 h-9 shrink-0">
            <div className="absolute inset-0 rounded-full bg-[#ff7a1a]/20 blur-md pointer-events-none" />
            <img
              src="/cookie-sticker.png"
              alt="Cookie Chain Logo"
              className="relative z-10 w-9 h-9 object-contain drop-shadow-[0_4px_10px_rgba(255,122,26,0.35)] transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="flex items-center gap-2.5">
            <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-[#f5ece1] leading-none">
              Cookie<span className="text-[#ffb347]">Dash</span>
            </span>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#1a1310] text-[#d4a15c] border border-[#38261e] uppercase tracking-widest inline-flex items-center">
              SVM cApp
            </span>
          </div>
        </div>

        {/* Center: External Quick Links (No redundant in-page anchor mirroring) */}
        <nav className="hidden md:flex items-center gap-2 text-xs font-mono text-[#8f8075]">
          <a
            href={COOKIE_CHAIN_CONFIG.bridgeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:text-[#f5ece1] hover:bg-[#1a1310] transition"
          >
            <span>Hyperlane Bridge</span>
            <ArrowUpRight className="w-3 h-3 text-[#d4a15c]" />
          </a>
          <a
            href={COOKIE_CHAIN_CONFIG.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:text-[#f5ece1] hover:bg-[#1a1310] transition"
          >
            <span>CookieScan</span>
            <Compass className="w-3 h-3 text-[#d4a15c]" />
          </a>
        </nav>

        {/* Right: Nightly RPC Config & Subtle Dark Wallet Button */}
        <div className="flex items-center gap-2.5">
          {isNightly && (
            <button
              onClick={handleSwitchNetwork}
              disabled={switchingNetwork}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1a1310] hover:bg-[#251b16] border border-[#38261e] text-xs font-mono text-[#d4a15c] transition"
              title="Set Cookie Chain RPC in Nightly"
            >
              {switchSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Connected</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-[#d4a15c]" />
                  <span>{switchingNetwork ? 'Setting...' : 'Nightly RPC'}</span>
                </>
              )}
            </button>
          )}

          {/* Wallet Button */}
          <div className="wallet-button-wrapper">
            <WalletMultiButton className="!bg-[#1a1310] hover:!bg-[#251b16] !text-[#f5ece1] !border !border-[#38261e] hover:!border-[#d4a15c] !h-9 !px-3.5 !rounded-xl !text-xs !font-mono !font-bold !transition-all !duration-150 !shadow-none" />
          </div>
        </div>
      </div>
    </header>
  )
}
