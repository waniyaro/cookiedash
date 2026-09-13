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
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-cookie-bg/85 border-b border-cookie-border/70 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 py-3 flex items-center justify-between gap-4">
        {/* Brand with Extracted Official Cookie Sticker */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-3 group cursor-pointer"
          >
            {/* The Extracted Cookie Sticker */}
            <div className="relative w-10 h-10 shrink-0">
              <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-md animate-glow-gold pointer-events-none" />
              <img
                src="/cookie-sticker.png"
                alt="Cookie Chain Logo"
                className="relative z-10 w-10 h-10 object-contain drop-shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 animate-cookie-float"
              />
            </div>

            {/* Brand Title */}
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-tight text-white leading-none group-hover:text-amber-200 transition-colors">
                Cookie<span className="text-cookie-blue">Dash</span>
              </span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                SVM
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live RPC Telemetry Pill & Quick Nav */}
        <div className="hidden md:flex items-center gap-3">
          {/* RPC Status Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cookie-card/80 border border-cookie-border text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isLive ? 'bg-emerald-400' : 'bg-amber-400'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isLive ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />
            </span>
            <span className="text-slate-300 font-medium">rpc.cookiescan.io</span>
            {currentSlot ? (
              <span className="text-sky-400 border-l border-cookie-border pl-2 font-semibold">
                #{currentSlot.toLocaleString()}
              </span>
            ) : null}
          </div>

          {/* Quick Anchor Links */}
          <nav className="flex items-center gap-1 text-xs font-medium text-slate-400">
            <button
              onClick={() => scrollTo('fortune-oven')}
              className="px-3 py-1.5 rounded-xl hover:text-white hover:bg-cookie-card/60 transition"
            >
              Inscribe
            </button>
            <a
              href={COOKIE_CHAIN_CONFIG.bridgeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:text-white hover:bg-cookie-card/60 transition"
            >
              <span>Bridge</span>
              <ArrowUpRight className="w-3 h-3 text-slate-500" />
            </a>
            <a
              href={COOKIE_CHAIN_CONFIG.explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl hover:text-white hover:bg-cookie-card/60 transition"
            >
              <span>CookieScan</span>
              <Compass className="w-3 h-3 text-slate-500" />
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
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-xs font-medium text-sky-300 transition"
              title="Set Cookie Chain RPC in Nightly"
            >
              {switchSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Connected</span>
                </>
              ) : (
                <>
                  <Shield className="w-3.5 h-3.5 text-sky-400" />
                  <span>{switchingNetwork ? 'Setting RPC...' : 'Set Nightly RPC'}</span>
                </>
              )}
            </button>
          )}

          {/* Wallet Button */}
          <div className="wallet-button-wrapper">
            <WalletMultiButton className="!bg-sky-500 hover:!bg-sky-400 !text-slate-950 !h-10 !px-4 !rounded-xl !text-xs !font-bold !transition-all !duration-150 !font-sans shadow-sm" />
          </div>
        </div>
      </div>
    </header>
  )
}

