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

  const scrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const isNightly = wallet?.adapter.name.toLowerCase().includes('nightly')

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#140d0a]/90 border-b border-[#3a251e]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        {/* Brand with Cookie Chain Logo & Warm Atmosphere */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 group cursor-pointer select-none"
        >
          <div className="relative w-10 h-10 shrink-0">
            <div className="absolute inset-0 rounded-full bg-[#ff7a1a]/20 blur-md pointer-events-none" />
            <img
              src="/cookie-sticker.png"
              alt="Cookie Chain Logo"
              className="relative z-10 w-10 h-10 object-contain drop-shadow-[0_4px_10px_rgba(255,122,26,0.35)] transition-transform duration-300 group-hover:scale-105"
            />
          </div>

          <div className="flex items-baseline gap-2">
            <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-[#f5ece1] leading-none">
              Cookie<span className="text-[#ffb347]">Dash</span>
            </span>
            <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#281a15] text-[#d4a15c] border border-[#3a251e] uppercase tracking-widest">
              SVM cApp
            </span>
          </div>
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 text-xs font-sans text-[#998376]">
          <button
            onClick={() => scrollTo('fortune-oven')}
            className="px-3 py-1.5 rounded-xl hover:text-[#f5ece1] hover:bg-[#1e1410] transition"
          >
            Fortune Oven
          </button>
          <button
            onClick={() => scrollTo('vault-section')}
            className="px-3 py-1.5 rounded-xl hover:text-[#f5ece1] hover:bg-[#1e1410] transition"
          >
            Pastry Vault
          </button>
          <button
            onClick={() => scrollTo('telemetry-section')}
            className="px-3 py-1.5 rounded-xl hover:text-[#f5ece1] hover:bg-[#1e1410] transition"
          >
            Hearth Gauges &amp; AI
          </button>
          <a
            href={COOKIE_CHAIN_CONFIG.bridgeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:text-[#f5ece1] hover:bg-[#1e1410] transition"
          >
            <span>Bridge</span>
            <ArrowUpRight className="w-3 h-3 text-[#d4a15c]" />
          </a>
          <a
            href={COOKIE_CHAIN_CONFIG.explorerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:text-[#f5ece1] hover:bg-[#1e1410] transition"
          >
            <span>Explorer</span>
            <Compass className="w-3 h-3 text-[#d4a15c]" />
          </a>
        </nav>

        {/* Right: Nightly RPC Config & Subtle Dark Wallet MultiButton */}
        <div className="flex items-center gap-2.5">
          {isNightly && (
            <button
              onClick={handleSwitchNetwork}
              disabled={switchingNetwork}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#281a15] hover:bg-[#33211b] border border-[#3a251e] text-xs font-mono text-[#d4a15c] transition"
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

          {/* Wallet Button - Sleek Dark Surface styling that honors the Single Accent rule */}
          <div className="wallet-button-wrapper">
            <WalletMultiButton className="!bg-[#281a15] hover:!bg-[#33211b] !text-[#f5ece1] !border !border-[#3a251e] hover:!border-[#d4a15c] !h-9 !px-3.5 !rounded-xl !text-xs !font-mono !font-bold !transition-all !duration-150 !shadow-none" />
          </div>
        </div>
      </div>
    </header>
  )
}
