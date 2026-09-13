import React, { useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { ArrowUpRight, CheckCircle2, Shield, Compass } from 'lucide-react'
import { COOKIE_CHAIN_CONFIG, switchNightlyToCookieChain } from '../config/network'

interface NavbarProps {
  isLive: boolean
  currentSlot?: number
}

export const Navbar: React.FC<NavbarProps> = ({ isLive, currentSlot }) => {
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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#080402]/90 border-b border-[#2e170c]/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        {/* Brand with Extracted Official Cookie Sticker & Artisan Glow */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group cursor-pointer select-none"
          >
            {/* The Extracted Cookie Sticker with Warm Oven Aura */}
            <div className="relative w-11 h-11 shrink-0">
              <div className="absolute inset-0 rounded-full bg-amber-500/25 blur-lg animate-ember pointer-events-none" />
              <img
                src="/cookie-sticker.png"
                alt="Cookie Chain Logo"
                className="relative z-10 w-11 h-11 object-contain drop-shadow-[0_4px_10px_rgba(234,88,12,0.45)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 animate-cookie-float"
              />
            </div>

            {/* Brand Title */}
            <div className="flex items-baseline gap-2">
              <span className="font-display font-black text-xl sm:text-2xl tracking-tight text-[#fffbeb] leading-none group-hover:text-amber-300 transition-colors">
                Cookie<span className="text-amber-400">Dash</span>
              </span>
              <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 uppercase tracking-widest">
                SVM Hearth
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Oven Beacon & Kitchen Links */}
        <div className="hidden md:flex items-center gap-3">
          {/* RPC Status Indicator */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#160b06] border border-[#3d1e10] text-xs font-mono shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLive ? 'bg-amber-400' : 'bg-rose-500'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isLive ? 'bg-amber-500' : 'bg-rose-600'
              }`} />
            </span>
            <span className="text-amber-200/90 font-medium">rpc.cookiescan.io</span>
            {currentSlot ? (
              <span className="text-amber-400 border-l border-[#3d1e10] pl-2 font-bold">
                #{currentSlot.toLocaleString()}
              </span>
            ) : null}
          </div>

          {/* Quick Anchor Links */}
          <nav className="flex items-center gap-1 text-xs font-medium text-amber-200/70">
            <button
              onClick={() => scrollTo('fortune-oven')}
              className="px-3 py-1.5 rounded-xl hover:text-amber-300 hover:bg-[#1a0e08] border border-transparent hover:border-[#3d1e10] transition font-sans"
            >
              🔥 Fortune Oven
            </button>
            <button
              onClick={() => scrollTo('vault-section')}
              className="px-3 py-1.5 rounded-xl hover:text-amber-300 hover:bg-[#1a0e08] border border-transparent hover:border-[#3d1e10] transition font-sans"
            >
              Vault
            </button>
            <a
              href={COOKIE_CHAIN_CONFIG.bridgeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:text-amber-300 hover:bg-[#1a0e08] border border-transparent hover:border-[#3d1e10] transition font-sans"
            >
              <span>Bridge</span>
              <ArrowUpRight className="w-3 h-3 text-amber-500/80" />
            </a>
            <a
              href={COOKIE_CHAIN_CONFIG.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:text-amber-300 hover:bg-[#1a0e08] border border-transparent hover:border-[#3d1e10] transition font-sans"
            >
              <span>CookieScan</span>
              <Compass className="w-3 h-3 text-amber-500/80" />
            </a>
          </nav>
        </div>

        {/* Right: Actions & Wallet MultiButton */}
        <div className="flex items-center gap-2.5">
          {/* Nightly Quick Config */}
          {isNightly && (
            <button
              onClick={handleSwitchNetwork}
              disabled={switchingNetwork}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-medium text-amber-300 transition"
              title="Set Cookie Chain RPC in Nightly"
            >
              {switchSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Connected</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  <span>{switchingNetwork ? 'Setting RPC...' : 'Nightly RPC'}</span>
                </>
              )}
            </button>
          )}

          {/* Wallet Button */}
          <div className="wallet-button-wrapper">
            <WalletMultiButton className="!bg-gradient-to-r !from-amber-500 !to-amber-600 hover:!from-amber-400 hover:!to-amber-500 !text-[#080402] !h-10 !px-4 !rounded-xl !text-xs !font-black !transition-all !duration-150 !font-sans shadow-md shadow-amber-500/20 !border !border-amber-400/30" />
          </div>
        </div>
      </div>
    </header>
  )
}

