import React, { useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { ExternalLink, CheckCircle2, Shield, Radio } from 'lucide-react'
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

  const isNightly = wallet?.adapter.name.toLowerCase().includes('nightly')

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-cookie-bg/90 border-b border-cookie-border/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 group cursor-pointer">
            {/* Animated Golden Cookie Emblem */}
            <div className="relative w-9 h-9 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full bg-amber-500/25 blur-md animate-glow-gold pointer-events-none" />
              <svg
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9 relative z-10 transition-transform duration-300 group-hover:rotate-12 animate-cookie-float drop-shadow-md"
              >
                {/* Cookie Base with Baked Gradient */}
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="url(#cookieGradient)"
                  stroke="#fbbf24"
                  strokeWidth="1.5"
                />
                {/* Chocolate Chips */}
                <circle cx="12" cy="13" r="2.2" fill="#582900" />
                <circle cx="21" cy="12" r="1.8" fill="#582900" />
                <circle cx="23" cy="20" r="2.2" fill="#582900" />
                <circle cx="13" cy="22" r="2" fill="#582900" />
                <circle cx="17.5" cy="18" r="1.6" fill="#451a03" />
                <circle cx="17" cy="25" r="1.4" fill="#582900" />
                {/* Baked Highlight */}
                <path
                  d="M9 13C10.5 8 16 6 21 7"
                  stroke="#fef08a"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  opacity="0.5"
                />
                <defs>
                  <radialGradient
                    id="cookieGradient"
                    cx="0"
                    cy="0"
                    r="1"
                    gradientUnits="userSpaceOnUse"
                    gradientTransform="translate(14 13) rotate(52) scale(18.5)"
                  >
                    <stop stopColor="#fbbf24" />
                    <stop offset="0.6" stopColor="#d97706" />
                    <stop offset="1" stopColor="#92400e" />
                  </radialGradient>
                </defs>
              </svg>
            </div>

            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-white group-hover:text-amber-200 transition-colors">
                Cookie<span className="text-cookie-blue">Dash</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                SVM
              </span>
            </div>
          </div>

          {/* RPC Connection Status */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-slate-800">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] font-mono">
              <Radio className={`w-3 h-3 ${isLive ? 'text-emerald-400 animate-pulse' : 'text-amber-400'}`} />
              <span className="text-slate-300">{isLive ? 'rpc.cookiescan.io' : 'Connecting...'}</span>
              {currentSlot ? (
                <span className="text-sky-400 border-l border-slate-800 pl-1.5">
                  #{currentSlot.toLocaleString()}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Actions & Wallet */}
        <div className="flex items-center gap-2.5">
          {/* Bridge Link */}
          <a
            href={COOKIE_CHAIN_CONFIG.bridgeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cookie-card hover:bg-cookie-surface border border-cookie-border text-xs font-medium text-slate-300 hover:text-white transition"
          >
            <span>Bridge</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          {/* Nightly Auto Switch */}
          {isNightly && (
            <button
              onClick={handleSwitchNetwork}
              disabled={switchingNetwork}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-xs font-medium text-sky-300 transition"
              title="Set Cookie Chain RPC in Nightly"
            >
              {switchSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Configured</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>{switchingNetwork ? 'Configuring...' : 'Set Nightly RPC'}</span>
                </>
              )}
            </button>
          )}

          {/* Wallet Button */}
          <div className="wallet-button-wrapper">
            <WalletMultiButton className="!bg-sky-500 hover:!bg-sky-400 !text-slate-950 !h-9 !px-4 !rounded-xl !text-xs !font-bold !transition-all !duration-150 !font-sans shadow-sm" />
          </div>
        </div>
      </div>
    </header>
  )
}
