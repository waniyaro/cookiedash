import React, { useState } from 'react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { ExternalLink, Sparkles, Flame, CheckCircle2 } from 'lucide-react'
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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-cookie-dark/85 border-b border-cookie-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Logo & Network Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-cookie-accent to-cookie-oven flex items-center justify-center shadow-cookie-glow text-2xl select-none">
              🍪
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white">
                  Cookie<span className="text-cookie-gold">Dash</span>
                </span>
                <span className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cookie-accent/15 text-cookie-gold border border-cookie-accent/30">
                  SVM Hub
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                The Bakery & Analytics Platform for Cookie Chain
              </p>
            </div>
          </div>

          {/* Live Node Status Pill */}
          <div className="hidden md:flex items-center gap-2 pl-4 border-l border-cookie-border/60">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
              <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              <span>{isLive ? 'Cookie Chain Online' : 'Connecting...'}</span>
              {currentSlot ? (
                <span className="text-slate-400 border-l border-emerald-500/20 pl-1.5">
                  #{currentSlot.toLocaleString()}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* Action Controls & Wallet Button */}
        <div className="flex items-center gap-3">
          {/* Bridge Link */}
          <a
            href={COOKIE_CHAIN_CONFIG.bridgeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cookie-card hover:bg-cookie-border/60 border border-cookie-border text-xs font-semibold text-slate-200 hover:text-cookie-gold transition-all duration-200"
          >
            <Sparkles className="w-3.5 h-3.5 text-cookie-gold" />
            <span>Bridge $COOK</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {/* Nightly Quick Switcher */}
          {isNightly && (
            <button
              onClick={handleSwitchNetwork}
              disabled={switchingNetwork}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cookie-accent/20 hover:bg-cookie-accent/30 border border-cookie-accent/40 text-xs font-medium text-cookie-gold transition"
              title="Set Cookie Chain RPC in Nightly"
            >
              {switchSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Switched!</span>
                </>
              ) : (
                <>
                  <Flame className="w-3.5 h-3.5 text-cookie-oven animate-pulse" />
                  <span>{switchingNetwork ? 'Switching...' : 'Nightly Config'}</span>
                </>
              )}
            </button>
          )}

          {/* Solana Wallet Adapter Button */}
          <div className="wallet-button-wrapper">
            <WalletMultiButton className="!bg-gradient-to-r !from-cookie-accent !to-cookie-oven hover:!brightness-110 !h-10 !px-4 !rounded-xl !text-xs !font-bold !tracking-wide !shadow-cookie-glow !transition-all !duration-200 !font-sans" />
          </div>
        </div>
      </div>
    </header>
  )
}
